import { expect } from "chai"
import request from "supertest"
import { SERVER } from "./TestContext"


describe("GET /api/jobs", () => {
    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs")
            .expect(401)
            .expect("content-type", /\btext\b/)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs")
            .set('Cookie', ['sid=whatever'])
            .send()
            .expect(401)
            .expect("content-type", /\btext\b/)
    });

    it("Works for admin", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs")
            .set('Cookie', ['sid=ADMIN_SID'])
            .send()
            .expect(200)
            .expect("content-type", /\bjson\b/)
            .expect(r => {
                expect(r.body.length).to.equal(2)
            })
    });

    it("Works for user", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs")
            .set('Cookie', ['sid=USER_SID'])
            .send()
            .expect(200)
            .expect("content-type", /\bjson\b/)
            .expect(r => {
                expect(r.body.length).to.equal(1)
            })
    });
})

describe("GET /api/jobs/:id", () => {
    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1")
            .expect(401)
            .expect("content-type", /\btext\b/)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1")
            .set('Cookie', ['sid=whatever'])
            .send()
            .expect(401)
            .expect("content-type", /\btext\b/)
    });

    it("Works for admin", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1")
            .set('Cookie', ['sid=ADMIN_SID'])
            .send()
            .expect(200)
            .expect("content-type", /\bjson\b/)
            .expect(r => {
                expect(r.body.id).to.equal(1)
            })
    });

    it("Rejects for non-authors", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1")
            .set('Cookie', ['sid=USER_SID'])
            .send()
            .expect(403)
            .expect("content-type", /\btext\b/)
    });

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/123")
            .set('Cookie', ['sid=USER_SID'])
            .send()
            .expect(404)
            .expect("content-type", /\btext\b/)
    });
})
