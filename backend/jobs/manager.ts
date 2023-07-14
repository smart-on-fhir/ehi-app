import { readdirSync, rmSync, statSync } from "fs";
import { readdir, rm } from "fs/promises";
import { join } from "path";
import config from "../config";
import db from "../db";

const UPLOADS_DIR = join(__dirname, "../uploads");

async function removeJobs(filter?: (id: string) => Promise<boolean>) {
  const items = await readdir(config.jobsDir);
  for (const id of items) {
    const dir = join(config.jobsDir, id);
    if (statSync(dir).isDirectory()) {
      if (!filter || (await filter(id))) {
        await rm(dir, { force: true, recursive: true });
      }
    }
  }
}

function deleteUploads() {
  const files = readdirSync(UPLOADS_DIR);
  for (const name of files) {
    const file = join(UPLOADS_DIR, name);
    if (statSync(file).isFile()) {
      rmSync(file, { force: true });
    }
  }
}

async function checkJobs() {
  const jobs = await db.promise(
    "all",
    "SELECT id, status, approvedAt FROM jobs"
  );

  for (const job of jobs) {
    if (
      job.status === "aborted" ||
      job.status === "deleted" ||
      (job.status === "retrieved" &&
        Date.now() - +(job.approvedAt || 0) >
          config.approvedJobMaxLifetimeMinutes * 60000)
    ) {
      await db.promise("run", "DELETE FROM jobs WHERE id=?", [job.id]);
      await rm(config.jobsDir + "/" + job.id, { force: true, recursive: true });
    }
  }

  setTimeout(checkJobs, config.deletedJobLifetime).unref();
}

// On startup
deleteUploads();
removeJobs();
setTimeout(checkJobs, 1000).unref();

export default {};
