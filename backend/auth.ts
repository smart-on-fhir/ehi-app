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
  const sid = req.cookies?.sid;
  if (sid) {
    try {
      const user = await db.promise(
        "get",
        "SELECT * FROM users WHERE sid=?",
        sid
      );
      (req as EHI.UserRequest).user = user || null;
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

    // Update user's lastLogin and sid properties
    await db.promise(
      "run",
      "UPDATE users SET sid=?, lastLogin=? WHERE id=?",
      sid,
      new Date(),
      user.id
    );

    // Use session cookies by default
    let expires: Date | undefined = undefined;

    // If "remember" is set use cookies that expire in one year
    if (remember) {
      expires = new Date();
      expires.setFullYear(new Date().getFullYear() + 1);
    }

    res.cookie("sid", sid, { httpOnly: true, expires });
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
      await db.promise(
        "run",
        "UPDATE users SET sid = NULL WHERE sid=?",
        user.sid
      );
      res.clearCookie("sid");
      return res.end("Logout successful");
    } catch (ex) {
      debug(ex + "");
    }
  }

  res.status(400).end("Logout failed");
}
