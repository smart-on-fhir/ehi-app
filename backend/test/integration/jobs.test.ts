import { expect } from "chai";
import request from "supertest";
import { SERVER } from "./TestContext";

function testEndpoint({
  method = "get",
  path,
}: {
  path: string;
  method?: "get" | "post" | "delete";
}) {
  it("Requires authentication", async () => {
    await request(SERVER.baseUrl)[method](path).send().expect(401);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
    [method](path)
      .set("Cookie", ["user_sid=whatever"])
      .send()
      .expect(401);
  });

  it("Works for user", async () => {
    await request(SERVER.baseUrl)
    [method](path)
      .set("Cookie", ["user_sid=USER_SID"])
      .send()
      .expect(200);
  });
  //   } else {
  //     it("Rejects user", async () => {
  //       await request(SERVER.baseUrl)
  //         [method](path)
  //         .set("Cookie", ["user_sid=USER_SID"])
  //         .send()
  //         .expect(403);
  //     });
  //   }
}

describe("GET /api/jobs", () => {
  testEndpoint({ path: "/api/jobs" });
});

describe("GET /api/jobs/:id", () => {
  testEndpoint({ path: "/api/jobs/1" });

  it("Rejects for non-authors", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(403);
  });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/123")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });
});

describe("POST /api/jobs/:id/abort", () => {
  testEndpoint({ path: "/api/jobs/1/abort", method: "post" });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .post("/api/jobs/123/abort")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });
});

describe("GET /api/jobs/:id/download", () => {

  it("Requires authentication", async () => {
    await request(SERVER.baseUrl).get("/api/jobs/1/download").expect(401);
  });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/123/download")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/1/download")
      .set("Cookie", ["user_sid=whatever"])
      .expect(401);
  });

  it("Rejects non-owner", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(403);
  });

  it("Works as expected", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(200)
      .expect("content-type", "application/zip");
  });
});

describe("GET /api/jobs/:id/download/:file", () => {

  it("Requires authentication", async () => {
    await request(SERVER.baseUrl).get("/api/jobs/1/download/Patient").expect(401);
  });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/123/download/Patient")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/1/download/Patient")
      .set("Cookie", ["user_sid=whatever"])
      .expect(401);
  });

  it("Rejects non-owner", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/Patient")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(403);
  });

  it("Returns 404 for missing files", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/Patient")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(404);
  });

  it.skip("Works as expected", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/Patient")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(200)
      .expect("content-type", "application/ndjson");
  });

});

describe("GET /api/jobs/:id/download/attachments/:file", () => {
  it("Requires authentication", async () => {
    await request(SERVER.baseUrl).get("/api/jobs/1/download/attachments/x").expect(401);
  });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/123/download/attachments/x")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/1/download/attachments/x")
      .set("Cookie", ["user_sid=whatever"])
      .expect(401);
  });

  it("Rejects non-owner", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/attachments/x")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(403);
  });

  it("Returns 404 for missing files", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/attachments/x")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(404);
  });

  it.skip("Works as expected", async () => {
    await request(SERVER.baseUrl)
      .get("/api/jobs/2/download/attachments/x")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(200)
      .expect("content-type", "application/ndjson");
  });
})

describe("DELETE /api/jobs/:id", () => {
  it("Requires authentication", async () => {
    await request(SERVER.baseUrl).delete("/api/jobs/1").expect(401);
  });

  it("Rejects for missing jobs", async () => {
    await request(SERVER.baseUrl)
      .delete("/api/jobs/123")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(404);
  });

  it("Rejects unknown users", async () => {
    await request(SERVER.baseUrl)
      .delete("/api/jobs/1")
      .set("Cookie", ["user_sid=whatever"])
      .expect(401);
  });

  it("Rejects non-owner", async () => {
    await request(SERVER.baseUrl)
      .delete("/api/jobs/2")
      .set("Cookie", ["user_sid=USER_SID"])
      .expect(403);
  });

  it("Works as expected", async () => {
    await request(SERVER.baseUrl)
      .delete("/api/jobs/2")
      .set("Cookie", ["user_sid=BACKUP_USER_SID"])
      .expect(200)
      .expect("content-type", /application\/json/);
  });
})