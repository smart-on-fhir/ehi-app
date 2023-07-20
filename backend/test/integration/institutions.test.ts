import { expect } from "chai";
import request from "supertest";
import db from "../../db";
import MockServer from "./MockServer";
import { SERVER } from "./TestContext";

describe("GET /api/institutions", () => {
  it("Requires authentication", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions")
      .expect(401)
      .expect("content-type", /\btext\b/);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions")
      .set("Cookie", ["user_sid=whatever"])
      .send()
      .expect(401)
      .expect("content-type", /\btext\b/);
  });

  it("Works for user", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions")
      .set("Cookie", ["user_sid=USER_SID"])
      .send()
      .expect(200)
      .expect("content-type", /\bjson\b/)
      .expect((r) => {
        expect(r.body.length).to.equal(6);
      });
  });
});

describe("GET /api/institutions/:id", () => {
  it("Requires authentication", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions/1")
      .expect(401)
      .expect("content-type", /\btext\b/);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions/1")
      .set("Cookie", ["user_sid=whatever"])
      .send()
      .expect(401)
      .expect("content-type", /\btext\b/);
  });

  it("Rejects for missing institutions", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions/123")
      .set("Cookie", ["user_sid=USER_SID"])
      .send()
      .expect(404)
      .expect("content-type", /\btext\b/);
  });
});

describe.skip("GET /api/institutions/:id/launch", () => {
  const mockServer = new MockServer();

  before(async () => {
    await mockServer.start();

    mockServer.mock("/metadata", { body: {} });
    // mockServer.mock("/authorize", { status: 404 })
    // mockServer.mock("/token", { status: 404 })
    mockServer.mock("/.well-known/smart-configuration", {
      body: {
        authorization_endpoint: mockServer.baseUrl + "/authorize",
        token_endpoint: mockServer.baseUrl + "/token",
      },
    });

    await db.promise(
      "run",
      `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
      [
        100,
        "Test Institution",
        mockServer.baseUrl,
        "address",
        0,
        "test_client_id",
        "offline_access patient/$ehi-export",
      ]
    );
  });

  after(async () => {
    await db.promise("run", `DELETE FROM institutions WHERE id=100`);
    await mockServer.stop();
  });

  it("TODO", async () => {
    await db.promise("run", `UPDATE users SET session = NULL `);

    const a = await request(SERVER.baseUrl)
      .get("/api/institutions/100/launch")
      .redirects(1)
      .set("Cookie", ["user_sid=ADMIN_SID"])
      // .send()
      .expect(console.log);
    // .expect(302)
    // .expect("location", /\/api\/institutions\/100\/redirect\?state=.+/);
    // --> http://127.0.0.1:8888/auth/authorize                  ?response_type=code&client_id=test_client_id&scope=offline_access%20patient%2F%24ehi-export&redirect_uri=http%3A%2F%2F127.0.0.1%3A5005%2Fapi%2Finstitutions%2F2%2Fredirect&aud=http%3A%2F%2F127.0.0.1%3A8888%2Ffhir&state=B9GLUJdVbiTRpOWI
    // --> http://127.0.0.1:8888/patient-login                   ?response_type=code&client_id=test_client_id&scope=offline_access+patient%2F%24ehi-export&redirect_uri=http%3A%2F%2F127.0.0.1%3A5005%2Fapi%2Finstitutions%2F2%2Fredirect&aud=http%3A%2F%2F127.0.0.1%3A8888%2Ffhir&state=B9GLUJdVbiTRpOWI
    // --> http://127.0.0.1:8888/authorize-app                   ?response_type=code&client_id=test_client_id&scope=offline_access+patient%2F%24ehi-export&redirect_uri=http%3A%2F%2F127.0.0.1%3A5005%2Fapi%2Finstitutions%2F2%2Fredirect&aud=http%3A%2F%2F127.0.0.1%3A8888%2Ffhir&state=B9GLUJdVbiTRpOWI&_patient=6c5d9ca9-54d7-42f5-bfae-a7c19cd217f2
    // --> http://127.0.0.1:5005/api/institutions/2/redirect     ?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7Im5lZWRfcGF0aWVudF9iYW5uZXIiOnRydWUsInBhdGllbnQiOiI2YzVkOWNhOS01NGQ3LTQyZjUtYmZhZS1hN2MxOWNkMjE3ZjIifSwiY2xpZW50X2lkIjoidGVzdF9jbGllbnRfaWQiLCJyZWRpcmVjdF91cmkiOiJodHRwOi8vMTI3LjAuMC4xOjUwMDUvYXBpL2luc3RpdHV0aW9ucy8yL3JlZGlyZWN0Iiwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyBwYXRpZW50LyRlaGktZXhwb3J0IiwiaWF0IjoxNjg2MDcyMjI3LCJleHAiOjE2ODYwNzI1Mjd9.GA0QH9pONW15ZqNoVAarl_pB3bO1RFzHof7HSydGSJw&state=B9GLUJdVbiTRpOWI
    // --> http://127.0.0.1:8888/jobs/bd5efb0ca70dbd5c/customize ?behavior=automatic&_patient=6c5d9ca9-54d7-42f5-bfae-a7c19cd217f2&redirect=http%3A%2F%2F127.0.0.1%3A3000%2Fjobs
    // --> http://127.0.0.1:3000/jobs

    // const u = new URL(a.headers.location)

    // // console.log(u)
    // const b = await request(SERVER.baseUrl)
    //     .get("/api/institutions/100/redirect?state=" + encodeURIComponent(u.searchParams.get("state")!))
    //     .set('Cookie', ['user_sid=ADMIN_SID'])
    //     .redirects(0)
    //     .send()
    //     .expect(console.log)
  });
});

describe("GET /api/institutions/:id/redirect", () => {});
