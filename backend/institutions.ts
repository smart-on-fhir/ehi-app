import smart from "fhirclient";
import express, { Request, Response } from "express";
import Job from "./jobs/Job";
import db from "./db";
import { HttpError } from "./errors";
import { asyncRouteWrap, getRequestBaseURL, getStorage } from "./lib";
import { authenticate, requireAuth } from "./auth";
import { EHI } from "./types";

const router = express.Router({ mergeParams: true });
export default router;

export async function byId(id: number) {
  const rec = await db.promise(
    "get",
    "SELECT * FROM institutions WHERE id = ?",
    [id]
  );
  if (!rec) {
    throw new HttpError("Record not found").status(404);
  }
  return rec;
}

export async function getOne(req: Request, res: Response) {
  res.json(await byId(+req.params.id));
}

export async function getAll(req: Request, res: Response) {
  res.json(
    await db.promise(
      "all",
      "SELECT id, displayName, location, disabled FROM institutions"
    )
  );
}

export async function startAuthorization(req: Request, res: Response) {
  const institution = await byId(+req.params.id);
  const storage = getStorage(req);
  await storage.clear();
  return smart(req, res, getStorage(req)).authorize({
    clientId: institution.clientId,
    scope: institution.scope,
    // NOTE: This base url should match whatever invokes completeAuthorization
    redirectUri: `/api/institutions/${
      institution.id
    }/redirect?referer=${req.get("referer")}`,
    iss: institution.fhirUrl,
  });
}

// The handler used in completing SMART Launch via redirectUri
export async function completeAuthorization(req: Request, res: Response) {
  const client = await smart(req, res, getStorage(req)).ready();
  const { response } = await client.request({
    url: `/Patient/${client.patient.id}/$ehi-export`,
    method: "POST",
    includeResponse: true,
  });

  const statusUrl = response.headers.get("Content-Location");

  const linkUrl = response.headers.get("Link");

  let customizeUrl = "";

  if (linkUrl) {
    // If there is a patient-interaction link, get it so we can redirect the user there
    const [href, rel] = linkUrl.split(/\s*;\s*/);
    if (href && rel === 'rel="patient-interaction"') {
      customizeUrl = href;
    }
  }

  const job = await Job.create({
    userId: (req as EHI.AuthenticatedRequest).user.id,
    patientId: client.patient.id!,
    statusUrl,
    customizeUrl,
    accessToken: client.state.tokenResponse!.access_token!,
    refreshToken: client.state.tokenResponse!.refresh_token!,
    tokenUri: client.state.tokenUri!,
  });

  // Parse off everything before the ? mark, get the referer param from that
  // BUG: will lose everything after a potential second ?
  const referer = new URLSearchParams(req.originalUrl.split("?")[1]).get(
    "referer"
  );
  // If we have a referer, use that; otherwise use req baseURL
  const redirectUrl = (referer || getRequestBaseURL(req) + "/") + "jobs";

  job.sync(); // START POOLING!!!

  if (customizeUrl) {
    let url = new URL(customizeUrl);
    url.searchParams.set("redirect", redirectUrl);
    res.redirect(url.href);
  } else {
    res.redirect(redirectUrl);
  }
}

router.get("/", authenticate, requireAuth(), asyncRouteWrap(getAll));
router.get("/:id", authenticate, requireAuth(), asyncRouteWrap(getOne));
router.get(
  "/:id/launch",
  authenticate,
  requireAuth(),
  asyncRouteWrap(startAuthorization)
);
router.get(
  "/:id/redirect",
  authenticate,
  requireAuth(),
  asyncRouteWrap(completeAuthorization)
);
