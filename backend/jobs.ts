import express, { Request, Response } from "express"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap } from "./lib"
import { authenticate, requireAuth } from "./auth"
import { EHI } from "./types"


const router = express.Router({ mergeParams: true });
export default router


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

router.post("/:id/add-file", asyncRouteWrap(async (req: Request, res: Response) => {
    throw new HttpError(`Action "add-file" not implemented yet`).status(400)
}))

router.post("/:id/remove-file", asyncRouteWrap(async (req: Request, res: Response) => {
    throw new HttpError(`Action "remove-file" not implemented yet`).status(400)
}))

router.post("/:id/download", asyncRouteWrap(async (req: Request, res: Response) => {
    throw new HttpError(`Action "download" not implemented yet`).status(400)
}))

