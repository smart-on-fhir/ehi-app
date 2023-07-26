import request from "supertest";
import { SERVER } from "./TestContext";
import db from "../../db";

describe("GET /api/login", () => {
  it("Rejects empty body", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .expect(401)
      .expect({ error: "Invalid username or password" });
  });

  it("Rejects missing username", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("password=whatever")
      .expect(401)
      .expect({ error: "Invalid username or password" });
  });

  it("Rejects missing password", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("username=patient")
      .expect(401)
      .expect({ error: "Invalid username or password" });
  });

  it("Rejects invalid username", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("username=whatever&password=whatever")
      .expect(401)
      .expect({ error: "Invalid username or password" });
  });

  it("Rejects invalid password", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("username=patient&password=whatever")
      .expect(401)
      .expect({ error: "Invalid username or password" });
  });

  it("Patient can login", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("username=patient&password=patient-password")
      .expect(200)
      .expect("set-cookie", /^user_sid=.+?;\s*Path=\//)
      .expect({ id: 1, username: "patient" });
  });

  it("Can create long sessions", async () => {
    await request(SERVER.baseUrl)
      .post("/api/login")
      .send("username=patient&password=patient-password&remember=true")
      .expect(200)
      .expect(
        "set-cookie",
        /^user_sid=.+?;\s*Path=\/;\s*Expires=.+?$/
      )
      .expect({ id: 1, username: "patient" });
  });
});

describe("GET /api/logout", () => {
  it("Rejects unauthorized users body", async () => {
    await request(SERVER.baseUrl)
      .get("/api/logout")
      .expect(400)
      .expect("Logout failed because you were not logged in");
  });

  it("Patient can logout", async () => {
    await request(SERVER.baseUrl)
      .get("/api/logout")
      .set("Cookie", ["user_sid=USER_SID"])
      .send()
      .expect(200)
      .expect("Logout successful");
  });
});
