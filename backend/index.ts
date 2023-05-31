import express, { NextFunction, Request, Response, urlencoded } from "express"
import cookieParser from "cookie-parser"
import { AddressInfo } from "net"
// import multer from "multer"
import config from "./config"
import { asyncRouteWrap } from "./lib"
import { HttpError } from "./errors"
import db from "./db"
import { authenticate, login, logout, requireAuth } from "./auth"
import Job from "./Job"
import { EHI } from "./types"


const app = express()
app.use(cookieParser())
// app.use(authenticate)

// const upload = multer({
//     dest: "uploads/",
//     limits: {
//         files: 5,
//         fileSize: 1024 * 1024 * 10 // 10MB
//     }
// })

// app.use(urlencoded({ extended: false, limit: "64kb" }));
// app.use(json());


// TODO:
app.get("/jobs/:id/download", () => { })
app.get("/jobs/:id/approve", () => { })
app.get("/jobs/:id/reject", () => { })
app.get("/jobs/:id/abort", () => { })
app.get("/jobs/:id/customize", () => { })
app.get("/jobs/:id/attachments/add", () => { })
app.get("/jobs/:id/attachments/remove", () => { })


// browse jobs
app.get("/jobs", authenticate, requireAuth("user", "admin"), asyncRouteWrap(async (req: Request, res: Response) => {
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

// view job
app.get("/jobs/:id", authenticate, requireAuth("user", "admin"), asyncRouteWrap(async (req: EHI.UserRequest, res: Response) => {
    const job = await db.promise("get", "SELECT * FROM jobs WHERE id = ?", req.params.id)
    if (!job) {
        return res.status(404).end("Job not found")
    }
    const { role, username } = (req as EHI.AuthenticatedRequest).user
    if (role !== "admin" && job.patient_id !== username) {
        return res.status(403).end("Permission denied")
    }
    res.json(new Job(job))
}))

app.post("/login", urlencoded({ extended: false }), asyncRouteWrap(login));

app.get("/logout", authenticate, asyncRouteWrap(logout))

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
        return error.render(req, res)
    }
    console.error(error);
    res.status(error.code || 500).json({ error: error.message || 'Internal Server Error' });
})

// Only start is not imported
if (require.main?.filename === __filename) {
    const server = app.listen(+config.port, config.host, () => {
        const address = server.address() as AddressInfo
        console.log(`Server available at http://${address.address}:${address.port}`)
    });
}


export default app