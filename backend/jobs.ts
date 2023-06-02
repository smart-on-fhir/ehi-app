import express, { Request, Response } from "express"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap } from "./lib"
import { authenticate, requireAuth } from "./auth"
import { EHI } from "./types"


const router = express.Router({ mergeParams: true });
export default router



router.get("/", authenticate, requireAuth("user", "admin"), asyncRouteWrap(async (req: Request, res: Response) => {
    const role = (req as EHI.AuthenticatedRequest).user.role
    const params: any[] = []
    let sql = "SELECT * FROM jobs"
    if (role !== "admin") {
        sql += " WHERE user_id=?"
        params.push(role)
    }
    const jobs = await db.promise("all", sql, params)
    res.json(jobs.map(j => new Job(j)))
}))

router.get("/:id", authenticate, requireAuth("user", "admin"), asyncRouteWrap(async (req: EHI.UserRequest, res: Response) => {
    const job = await db.promise("get", "SELECT * FROM jobs WHERE id = ?", req.params.id)
    if (!job) {
        throw new HttpError("Job not found").status(404)
    }
    const { role, username } = (req as EHI.AuthenticatedRequest).user
    if (role !== "admin" && job.patient_id !== username) {
        throw new HttpError("Permission denied").status(403)
    }
    res.json(new Job(job))
}))
