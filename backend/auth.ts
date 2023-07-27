import { NextFunction, Request, Response } from "express";
import Crypto from "crypto";
import Bcrypt from "bcryptjs";
import { debuglog } from "node:util";
import db from "./db";
import { wait } from "./lib";
import { EHI } from "./types";
import config from "./config";

const debug = debuglog("app:auth");

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sid = req.cookies?.user_sid;
  if (sid) {
    try {
      const user = await db.promise(
        "get",
        `SELECT u.id as id, u.username, s.id as sid, s.session
         FROM sessions s LEFT JOIN users u ON u.id = s.user_id
         WHERE s.id=?`,
        sid
      );
      if (user) {
        if (config.rollingSession && req.headers["x-request-type"] !== "polling") {
          const expires = new Date()
          expires.setMinutes(expires.getMinutes() + config.sessionLifetimeMinutes);
          await db.promise(
            "run",
            "UPDATE sessions SET expires=? WHERE id=?",
            expires,
            sid
          );
          res.cookie("user_sid", sid, { httpOnly: true, expires, sameSite: "none", secure: true });
        }
        (req as EHI.UserRequest).user = user;
      } else { 
        // Delete the user_sid cookie if there is user matching this session
        res.clearCookie("user_sid")
          .clearCookie("patients")
      }
    } catch (ex) {
      debug(ex + "");
    }
  }

  next();
}

export function requireAuth() {
  return function (req: EHI.UserRequest, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      return res.status(401).type("text").end("Authorization required");
    }

    next();
  };
}

export async function login(req: Request, res: Response) {
  // 1 second artificial delay to protect from automated brute-force attacks
  await wait(config.authDelay);

  // Whenever somebody tries to login, also delete any expired sessions
  await db.promise("run", "DELETE FROM sessions WHERE expires <= ?", Date.now()).catch();

  try {
    const { username, password, remember } = req.body;

    // No such username (Do NOT specify what is wrong in the error message!)
    if (!username || !password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = await db.promise(
      "get",
      "SELECT * FROM users WHERE username=?",
      username
    );

    // No such username (Do NOT specify what is wrong in the error message!)
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Wrong password (Do NOT specify what is wrong in the error message!)
    if (!Bcrypt.compareSync(password, user.password)) {
      debug("Failed login attempt due to invalid password");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate SID and update the user in DB
    const sid = Crypto.randomBytes(32).toString("hex");

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + config.sessionLifetimeMinutes);

    await db.promise(
      "run",
      "INSERT INTO sessions (id, user_id, expires) VALUES (?, ?, ?)",
      sid,
      user.id,
      expires
    );

    res.cookie("user_sid", sid, { httpOnly: true, expires, sameSite: "none", secure: true });
    res.json({ id: user.id, username: user.username });
  } catch (ex) {
    debug(ex + "");
    res.status(401).json({ error: "Login failed" });
  }
}

export async function logout(req: EHI.UserRequest, res: Response) {
  await wait(config.authDelay);
  const user = req.user;
  if (user) {
    try {
      await db.promise("run", "DELETE FROM sessions WHERE id=?", user.sid);
      return res.clearCookie("user_sid")
        .clearCookie("patients")
        .end("Logout successful");
    } catch (ex) {
      debug(ex + "");
      return res.status(400).end("Logout failed");
    }
  }
  res.status(400).end("Logout failed because you were not logged in");
}