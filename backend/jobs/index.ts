import express, { Request, Response } from "express";
import archiver from "archiver";
import { join } from "path";
import { statSync } from "fs";
import { readdir } from "fs/promises";
import Job from "./Job";
import db from "../db";
import { HttpError } from "../errors";
import { asyncRouteWrap } from "../lib";
import { authenticate, requireAuth } from "../auth";
import { EHI } from "../types";

const router = express.Router({ mergeParams: true });
export default router;

function requireOwner(job: Job, req: Request) {
  const { id } = (req as EHI.AuthenticatedRequest).user;
  if (job.userId !== id) {
    throw new HttpError("Permission denied").status(403);
  }
}

router.use(authenticate);
router.use(requireAuth());

router.get(
  "/",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const { id } = (req as EHI.AuthenticatedRequest).user;
    const jobs = await db.promise("all", "SELECT * FROM jobs WHERE userId=?", [id]);
    res.json(jobs.map((j: any) => new Job(j)));
  })
);

router.get(
  "/:id",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    res.json(job);
  })
);

router.delete(
  "/:id",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    await job.destroy();
    res.json(job);
  })
);

router.post(
  "/:id/abort",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    await job.abort();
    res.json(job);
  })
);

router.get(
  "/:id/download",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    const archive = archiver("zip", { zlib: { level: 9 } });

    const date = new Date(job.manifest!.transactionTime);
    const filename = `EHI Export ${date.toDateString()}.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    archive.pipe(res);

    const items = await readdir(job.directory);
    for (const name of items) {
      const path = join(job.directory, name);
      if (name.endsWith(".ndjson") && statSync(path).isFile()) {
        archive.file(path, { name });
      }
      archive.directory(join(job.directory, "attachments"), "attachments");
      archive.append(JSON.stringify(job.manifest, null, 4), {
        name: "manifest.json",
      });
    }

    archive.finalize();
  })
);

router.get(
  "/:id/download/:file",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    const filePath = join(job.directory, req.params.file);
    if (!statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
      throw new HttpError(`This job has no file "${req.params.file}"`).status(
        404
      );
    }
    res.sendFile(filePath);
  })
);

router.get(
  "/:id/download/attachments/:file",
  asyncRouteWrap(async (req: Request, res: Response) => {
    const job = await Job.byId(+req.params.id);
    requireOwner(job, req);
    const filePath = join(job.directory, "attachments", req.params.file);
    if (!statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
      throw new HttpError(
        `This job has no attachment "${req.params.file}"`
      ).status(404);
    }
    res.sendFile(filePath);
  })
);
