import express, { Request, Response } from "express"
import archiver from "archiver"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap, getRequestBaseURL } from "./lib"
import { authenticate, requireAuth } from "./auth"
import { EHI } from "./types"
import multer from "multer"
import { readdir } from "fs/promises"
import { join } from "path"
import { statSync } from "fs"


const router = express.Router({ mergeParams: true });
export default router

const upload = multer({
    dest: "uploads/",
    limits: {
        files: 5,
        fileSize: 1024 * 1024 * 10 // 10MB
    }
})


function requireAdminOrOwner(job: Job, req: Request) {
    const { role, id } = (req as EHI.AuthenticatedRequest).user
    if (role !== "admin" && job.userId !== id) {
        throw new HttpError("Permission denied").status(403)
    }
}

router.use(authenticate)
router.use(requireAuth("user", "admin"))

router.get("/", asyncRouteWrap(async (req: Request, res: Response) => {
    const { role, id: userId } = (req as EHI.AuthenticatedRequest).user
    const params: any[] = []
    let sql = "SELECT * FROM jobs"
    if (role !== "admin") {
        sql += " WHERE userId=?"
        params.push(userId)
    }
    const jobs = await db.promise("all", sql, params)
    res.json(jobs.map((j: any) => new Job(j)))
}))

router.get("/:id", asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    res.json(job)
}))

router.delete("/:id", requireAuth("admin"), asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    await job.destroy()
    res.json(job)
}))

router.post("/:id/approve", asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    job.status = "approved"
    await job.save()
    res.json(job)
}))

router.post("/:id/reject", asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    job.status = "rejected"
    await job.save()
    res.json(job)
}))

router.post("/:id/abort", asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    await job.abort()
    res.json(job)
}))

router.post("/:id/add-files", upload.array("attachments", 10), requireAuth("admin"), asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    const files = ((req.files || []) as Express.Multer.File[]).filter(f => f.fieldname === "attachments")
    if (!files.length) {
        throw new HttpError('Called "addAttachments" without uploaded "attachments"').status(400)
    }
    const baseUrl = getRequestBaseURL(req)
    for (const file of files) {
        await job.addAttachment(file, baseUrl)
    }
    res.json(job)
}))

router.post("/:id/remove-files", express.json(), requireAuth("admin"), asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    const files = req.body.params || []
    for (const file of files) {
        await job.removeAttachment(file)
    }
    res.json(job)
}))

router.get("/:id/download", asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    const archive = archiver('zip', { zlib: { level: 9 } });

    const date = new Date(job.manifest!.transactionTime)
    const filename = `EHI Export ${date.toDateString()}.zip`

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    archive.pipe(res);

    const items = await readdir(job.directory);
    for (const name of items) {
        const path = join(job.directory, name)
        if (name.endsWith(".ndjson") && statSync(path).isFile()) {
            archive.file(path, { name });
        }
        archive.directory(join(job.directory, "attachments"), "attachments");
        archive.append(JSON.stringify(job.manifest, null, 4), { name: "manifest.json" });
    }

    archive.finalize();
}))

