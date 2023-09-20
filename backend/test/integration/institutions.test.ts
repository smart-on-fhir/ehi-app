import nock from "nock"
import { expect } from "chai";
import request from "supertest";
import db from "../../db";
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

describe("GET /api/institutions/:id/launch", () => {

  it("rejects for unknown institutions", async () => {
    await request(SERVER.baseUrl)
      .get("/api/institutions/100/launch")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404)
  })

  it("works", async () => {

    nock("http://fhir-server.org")
      .get("/.well-known/smart-configuration")
      .reply(200, {
        authorization_endpoint: "http://fhir-server.org/authorize",
        token_endpoint: "http://fhir-server.org/token",
      })

    nock("http://fhir-server.org")
      .get("/authorize")
      .query(true)
      .reply(302, {
        location: SERVER.baseUrl + "/api/institutions/1/redirect"
      })

    await request(SERVER.baseUrl)
      .get("/api/institutions/1/launch")
      .redirects(0)
      .set("Cookie", ["user_sid=USER_SID"])
      .expect("location", /^http:\/\/fhir-server\.org\/authorize\?response_type=code.+$/)
  });
});

describe.skip("GET /api/institutions/:id/redirect", () => {
  it("works", async () => {
    await db.promise("run", `update "sessions" set "session"=? where "id"='USER_SID'`, [JSON.stringify({
      SMART_KEY: "MY_TEST_KEY",
      MY_TEST_KEY: {
        clientId: "institution_1_client_id",
        scope: "offline_access patient/$ehi-export",
        redirectUri: `${SERVER.baseUrl}/api/institutions/1/redirect?referer=${encodeURIComponent(SERVER.baseUrl)}&patients=7a05bc93-cf1a-4929-9aca-6178ba9abcb7`,
        serverUrl: "http://fhir-server.org",
        tokenResponse: {
          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIHBhdGllbnQvJGVoaS1leHBvcnQiLCJpYXQiOjE2OTA5MTQwODMsImV4cCI6MTY5MDkxNzY4M30.Hy_QzFmLWGDdSmaOxADz0a3K2MxfNoPb3r5OZNcNTIg",
          "token_type": "Bearer",
          "expires_in": 3600,
          "scope": "offline_access patient/$ehi-export",
          "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7Im5lZWRfcGF0aWVudF9iYW5uZXIiOnRydWUsInBhdGllbnQiOiJmZGVkY2RlOS0zYWE1LTQxMWYtYmJkYy04NTA1MmVjNGVmN2YifSwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyBwYXRpZW50LyRlaGktZXhwb3J0IiwiaWF0IjoxNjkwOTE0MDgzLCJleHAiOjE3MjI0NTAwODN9.qopwVCUbDofzID5uD2KhZfxEsSm-M-Bm7JlNkbQrdDo",
          "need_patient_banner": true,
          "patient": "fdedcde9-3aa5-411f-bbdc-85052ec4ef7f"
        },
        key: "MY_TEST_KEY",
        registrationUri: "",
        authorizeUri: "https://ehi-server.smarthealthit.org/auth/authorize",
        tokenUri: "https://ehi-server.smarthealthit.org/auth/token",
        codeChallengeMethods: [],
        expiresAt: 1690917683
      }
    })]);

    nock("http://fhir-server.org")
      .post("/auth/token")
      .query(true)
      .reply(200, {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIHBhdGllbnQvJGVoaS1leHBvcnQiLCJpYXQiOjE2OTA5MTQwODMsImV4cCI6MTY5MDkxNzY4M30.Hy_QzFmLWGDdSmaOxADz0a3K2MxfNoPb3r5OZNcNTIg",
        "token_type": "Bearer",
        "expires_in": 3600,
        "scope": "offline_access patient/$ehi-export",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7Im5lZWRfcGF0aWVudF9iYW5uZXIiOnRydWUsInBhdGllbnQiOiJmZGVkY2RlOS0zYWE1LTQxMWYtYmJkYy04NTA1MmVjNGVmN2YifSwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyBwYXRpZW50LyRlaGktZXhwb3J0IiwiaWF0IjoxNjkwOTE0MDgzLCJleHAiOjE3MjI0NTAwODN9.qopwVCUbDofzID5uD2KhZfxEsSm-M-Bm7JlNkbQrdDo",
        "need_patient_banner": true,
        "patient": "fdedcde9-3aa5-411f-bbdc-85052ec4ef7f"
      })

    nock("http://fhir-server.org")
      .post("/Patient/fdedcde9-3aa5-411f-bbdc-85052ec4ef7f/$ehi-export")
      .query(true)
      .reply(200, {})

    await request(SERVER.baseUrl)
      .get("/api/institutions/1/redirect")
      .query({ code: "whatever", state: "MY_TEST_KEY" })
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(302)
      .expect("location", SERVER.baseUrl + "/jobs")
  })
});
