import nock from "nock"
import { join } from "path"
import { expect } from "chai"
import { rm } from "fs/promises"
import config from "../../config"
import Job from "../../jobs/Job"
import { EHI } from "../../types"


describe("Job", () => {

  afterEach(async () => {
    await rm(join(config.jobsDir, "1000"), { force: true, recursive: true })
  })

  it("constructor", () => {
    const job = new Job({
      id: 1000
    } as EHI.PatientExportJobDbRecord)

    expect(job.manifest, "Job manifest should default to null").to.equal(null)

    // @ts-ignore
    expect(job.attachments, "Job attachments should default to []").to.deep.equal([])
  });

  it("create", async () => {
    const job = await Job.create({
      userId: 1000,
      accessToken: "test-accessToken",
      patientId: "test-patientId",
      refreshToken: "test-refreshToken",
      statusUrl: "test-statusUrl",
      tokenUri: "test-tokenUri"
    })

    // @ts-ignore
    expect(job.userId).to.equal(1000)
    // @ts-ignore
    expect(job.accessToken).to.equal("test-accessToken")
    // @ts-ignore
    expect(job.refreshToken).to.equal("test-refreshToken")
    // @ts-ignore
    expect(job.tokenUri).to.equal("test-tokenUri")

    expect(job.patientId).to.equal("test-patientId")
    expect(job.statusUrl).to.equal("test-statusUrl")
  })

  it("byId", async () => {
    const job = await Job.byId(1)
    expect(job.patientId).to.equal("sample_patient_id")
  })

  it("abort attempts to also abort the remote job if any", async () => {

    let calls = 0

    nock("http://ehi-server.org")
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .delete("/jobs/remote-job-1-id/status")
      .reply(404, () => {
        calls++
        return "Job not found"
      });

    const job = await Job.byId(1)
    job.setStatus("requested")
    await job.abort()

    expect(calls).to.equal(1)
  })

  it("destroy", async () => {
    const job = await Job.byId(1)
    job.setStatus("requested")
    await job.destroy()
  })
});
