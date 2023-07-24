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

  const redirectUri = new URL(`/api/institutions/${institution.id}/redirect`, getRequestBaseURL(req))
  redirectUri.searchParams.set("referer", req.get("referer") || "")
  redirectUri.searchParams.set("patients", req.cookies.patients || "")

  return smart(req, res, getStorage(req)).authorize({
    clientId: institution.clientId,
    scope: institution.scope,
    redirectUri: redirectUri.href,
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

  const patients = String(req.query.patients || "").trim().split(/\s*,\s*/).filter(Boolean)
  patients.push(client.patient.id!)

  // If we have a referer, use that; otherwise use req baseURL
  const redirectUrl = [
    req.query.referer || getRequestBaseURL(req),
    `/jobs`
  ].join("/").replace(/\/+/g, "/");

  job.sync(); // START POOLING!!!

  res.cookie("patients", patients.join(","));

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
