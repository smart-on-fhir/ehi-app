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

router.get("/:id", authenticate, requireAuth("user", "admin"), asyncRouteWrap(async (req: EHI.UserRequest, res: Response) => {
    const job = await Job.byId(+req.params.id)
    const { role, id } = (req as EHI.AuthenticatedRequest).user
    if (role !== "admin" && job.userId !== id) {
        throw new HttpError("Permission denied").status(403)
    }
    res.json(job)
}))

router.post("/:id/:action", (req: EHI.UserRequest, res: Response) => {
    res.json({ result: "Not implemented yet" })
})