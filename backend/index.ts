import Path from "path"
import express, { NextFunction, Request, Response, urlencoded } from "express"
import { AddressInfo } from "net"
import cookieParser from "cookie-parser"
import session from "express-session"
// import multer from "multer"
import config from "./config"
import { asyncRouteWrap } from "./lib"
import { HttpError } from "./errors"
import { authenticate, login, logout } from "./auth"
import institutionsRouter from "./institutions"
import jobsRouter from "./jobs"


const app = express()
app.use(cookieParser())


// The SMART state is stored in a session. If you want to clear your session
// and start over, you will have to delete your "connect.sid" cookie!
app.use(session({
    secret: "my secret", // FIXME:
    resave: false,
    saveUninitialized: false
}));

// const upload = multer({
//     dest: "uploads/",
//     limits: {
//         files: 5,
//         fileSize: 1024 * 1024 * 10 // 10MB
//     }
// })

// app.use(urlencoded({ extended: false, limit: "64kb" }));
// app.use(json());

app.use("/institutions", institutionsRouter)

app.use("/jobs", jobsRouter)

app.post("/login", urlencoded({ extended: false }), asyncRouteWrap(login));

app.get("/logout", authenticate, asyncRouteWrap(logout))

app.use(express.static(Path.join(__dirname, "../build/")));

app.get("*", (req, res) => res.sendFile("index.html", { root: Path.join(__dirname, "../build/") }));

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