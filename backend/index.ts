import Path from "path";
import express, { NextFunction, Request, Response, urlencoded } from "express";
import { AddressInfo } from "net";
import cookieParser from "cookie-parser";
import config from "./config";
import { asyncRouteWrap } from "./lib";
import { HttpError } from "./errors";
import { authenticate, login, logout } from "./authPatient";
import adminJobsRouter from "./jobs";
import institutionsRouter from "./institutionsPatient";
import patientJobsRouter from "./jobs/patient";
import "./jobs/manager";

const app = express();

app.use(cookieParser());

app.use("/api/institutions", institutionsRouter);

app.use("/api/patientJobs", patientJobsRouter);

app.use("/api/jobs", adminJobsRouter);

app.post("/api/login", urlencoded({ extended: false }), asyncRouteWrap(login));

app.get("/api/logout", authenticate, asyncRouteWrap(logout));

app.use(express.static(Path.join(__dirname, "../build/")));

app.get("*", (req, res) =>
  res.sendFile("index.html", { root: Path.join(__dirname, "../build/") })
);

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HttpError) {
    return error.render(req, res);
  }
  console.error(error);
  res
    .status(error.code || 500)
    .json({ error: error.message || "Internal Server Error" });
});

// Only start if not imported
if (require.main?.filename === __filename) {
  const server = app.listen(+config.port, config.host, () => {
    const address = server.address() as AddressInfo;
    console.log(
      `Server available at http://${address.address}:${address.port}`
    );
  });
}

export default app;
