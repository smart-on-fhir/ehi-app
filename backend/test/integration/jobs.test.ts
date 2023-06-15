import { expect } from "chai"
import request from "supertest"
import { SERVER } from "./TestContext"


function testEndpoint({
    roles,
    method = "get",
    path
}: {
    path: string
    roles: string[]
    method?: "get" | "post" | "delete"
}) {
    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)[method](path).send().expect(401)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)[method](path).set('Cookie', ['sid=whatever']).send().expect(401)
    });

    if (roles.includes("admin")) {
        it("Works for admin", async () => {
            await request(SERVER.baseUrl)[method](path).set('Cookie', ['sid=ADMIN_SID']).send().expect(200)
        })
    } else {
        it("Rejects admin", async () => {
            await request(SERVER.baseUrl)[method](path).set('Cookie', ['sid=ADMIN_SID']).send().expect(403)
        })
    }

    if (roles.includes("user")) {
        it("Works for user", async () => {
            await request(SERVER.baseUrl)[method](path).set('Cookie', ['sid=USER_SID']).send().expect(200)
        })
    } else {
        it("Rejects user", async () => {
            await request(SERVER.baseUrl)[method](path).set('Cookie', ['sid=USER_SID']).send().expect(403)
        })
    }
}


describe("GET /api/jobs", () => {

    testEndpoint({
        path: "/api/jobs",
        method: "get",
        roles: ["user", "admin"]
    })
})

describe("GET /api/jobs/:id", () => {

    testEndpoint({
        path: "/api/jobs/2",
        method: "get",
        roles: ["user", "admin"]
    })

    it("Rejects for non-authors", async () => {
        await request(SERVER.baseUrl).get("/api/jobs/1").set('Cookie', ['sid=USER_SID']).expect(403)
    });

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl).get("/api/jobs/123").set('Cookie', ['sid=USER_SID']).expect(404)
    });
})

describe("POST /api/jobs/:id/approve", () => {

    testEndpoint({
        path: "/api/jobs/1/approve",
        method: "post",
        roles: ["admin"]
    })

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl).post("/api/jobs/123/approve").set('Cookie', ['sid=ADMIN_SID']).expect(404)
    });
})

describe("POST /api/jobs/:id/reject", () => {

    testEndpoint({
        path: "/api/jobs/1/reject",
        method: "post",
        roles: ["admin"]
    })

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl).post("/api/jobs/123/reject").set('Cookie', ['sid=ADMIN_SID']).expect(404)
    });
})

describe("DELETE /api/jobs/:id", () => {

    testEndpoint({
        path: "/api/jobs/1",
        method: "delete",
        roles: ["admin"]
    })

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl).delete("/api/jobs/123").set('Cookie', ['sid=ADMIN_SID']).expect(404)
    });
})

describe("POST /api/jobs/:id/abort", () => {

    testEndpoint({
        path: "/api/jobs/1/abort",
        method: "post",
        roles: ["admin"]
    })

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl).post("/api/jobs/123/abort").set('Cookie', ['sid=ADMIN_SID']).expect(404)
    });
})

describe("POST /api/jobs/:id/add-files", () => {

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/add-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(404)
    });

    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/add-files")
            .send()
            .expect(401)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/add-files")
            .set('Cookie', ['sid=whatever'])
            .expect(401)
    });

    it("Allows admin", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/add-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(400, 'Called "addAttachments" without uploaded "attachments"')
    });

    it("Rejects owner", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/2/add-files")
            .set('Cookie', ['sid=USER_SID'])
            .expect(403)
    });

    it("Rejects non-owner", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/add-files")
            .set('Cookie', ['sid=USER_SID'])
            .expect(403)
    });

    it("Works as expected", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/2")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(200)
            .expect(res => {
                const { output } = res.body.manifest
                expect(output).to.be.instanceOf(Array)
                expect(output.length).to.equal(4)
                expect(output.find((x: any) => x.type === "DocumentReference")).to.be.undefined
            });

        await request(SERVER.baseUrl)
            .post("/api/jobs/2/add-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .attach("attachments", "backend/test/fixtures/img3.png")
            .attach("attachments", "backend/test/fixtures/img2.png")
            .expect(200)
            .expect(res => {
                const { output } = res.body.manifest
                expect(output).to.be.instanceOf(Array)
                expect(output.length).to.equal(5)
                const entry = output.find((x: any) => x.type === "DocumentReference")
                expect(entry).to.exist
                expect(entry.url).to.match(/DocumentReference$/)
                expect(entry.count).to.equal(2)
            })
    });
})

describe("POST /api/jobs/:id/remove-files", () => {

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/remove-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(404)
    });

    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/remove-files")
            .expect(401)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/123/remove-files")
            .set('Cookie', ['sid=whatever'])
            .expect(401)
    });

    it("Rejects owner", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/2/remove-files")
            .set('Cookie', ['sid=USER_SID'])
            .expect(403)
    });

    it("Rejects non-owner", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/remove-files")
            .set('Cookie', ['sid=USER_SID'])
            .expect(403)
    });

    it("Ignores missing files", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/remove-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .send({ params: ["img3.png"] })
            .expect(200)
    });

    it("Ignores empty params", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/remove-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .send({ params: [] })
            .expect(200)
    });

    it("Ignores missing params", async () => {
        await request(SERVER.baseUrl)
            .post("/api/jobs/1/remove-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(200)
    });

    it("Works as expected", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/2")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(200)
            .expect(res => {
                const { output } = res.body.manifest
                expect(output).to.be.instanceOf(Array)
                expect(output.length).to.equal(4)
                expect(output.find((x: any) => x.type === "DocumentReference")).to.be.undefined
            });

        let res2 = await request(SERVER.baseUrl)
            .post("/api/jobs/2/add-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .attach("attachments", "backend/test/fixtures/img3.png")
            .attach("attachments", "backend/test/fixtures/img2.png")
            .expect(200)
            .expect(res => {
                const { output } = res.body.manifest
                expect(output).to.be.instanceOf(Array)
                expect(output.length).to.equal(5)
                const entry = output.find((x: any) => x.type === "DocumentReference")
                expect(entry).to.exist
                expect(entry.url).to.match(/DocumentReference$/)
                expect(entry.count).to.equal(2)
            })

        await request(SERVER.baseUrl)
            .post("/api/jobs/2/remove-files")
            .set('Cookie', ['sid=ADMIN_SID'])
            .send({ params: [res2.body.attachments[0].title] })
            .expect(200)
            .expect(res => {
                const { output } = res.body.manifest
                expect(output).to.be.instanceOf(Array)
                expect(output.length).to.equal(5)
                const entry = output.find((x: any) => x.type === "DocumentReference")
                expect(entry).to.exist
                expect(entry.url).to.match(/DocumentReference$/)
                expect(entry.count).to.equal(1)
            })
    });
})

describe("GET /api/jobs/:id/download", () => {

    it("Rejects for missing jobs", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/123/download")
            .set('Cookie', ['sid=ADMIN_SID'])
            .expect(404)
    });

    it("Requires authentication", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1/download")
            .expect(401)
    });

    it("Rejects unknown users", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1/download")
            .set('Cookie', ['sid=whatever'])
            .expect(401)
    });

    it("Rejects non-owner", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/1/download")
            .set('Cookie', ['sid=USER_SID'])
            .expect(403)
    });

    it("Works as expected", async () => {
        await request(SERVER.baseUrl)
            .get("/api/jobs/2/download")
            .set('Cookie', ['sid=USER_SID'])
            .expect(200)
            .expect("content-type", "application/zip")
    })

})
