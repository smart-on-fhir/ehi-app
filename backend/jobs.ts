import express, { Request, Response } from "express"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap, getRequestBaseURL } from "./lib"
import { authenticate, requireAuth } from "./auth"
import { EHI } from "./types"
import multer from "multer"


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

router.delete("/:id", asyncRouteWrap(async (req: Request, res: Response) => {
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
    throw new HttpError(`Action "abort" not implemented yet`).status(400)
}))

router.post("/:id/add-files", upload.array("attachments", 10), asyncRouteWrap(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]).filter(f => f.fieldname === "attachments")
    if (!files.length) {
        throw new HttpError('Called "addAttachments" without uploaded "attachments"').status(400)
    }
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    const baseUrl = getRequestBaseURL(req)
    for (const file of files) {
        await job.addAttachment(file, baseUrl)
    }
    res.json(job)
}))

router.post("/:id/remove-files", express.json(), asyncRouteWrap(async (req: Request, res: Response) => {
    const files = req.body.params
    if (!files || !files.length) {
        throw new HttpError('Called "remove-file" without attachment filenames').status(400)
    }
    const job = await Job.byId(+req.params.id)
    requireAdminOrOwner(job, req)
    for (const file of files) {
        await job.removeAttachment(file)
    }
    res.json(job)
}))

router.post("/:id/download", asyncRouteWrap(async (req: Request, res: Response) => {
    throw new HttpError(`Action "download" not implemented yet`).status(400)
}))

