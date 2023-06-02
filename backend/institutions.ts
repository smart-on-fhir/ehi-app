import smart from "fhirclient"
import express, { Request, Response } from "express"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap } from "./lib"
import { authenticate, requireAuth } from "./auth"


const router = express.Router({ mergeParams: true });
export default router

export async function byId(id: number) {
    const rec = await db.promise("get", "SELECT * FROM institutions WHERE id = ?", [id])
    if (!rec) {
        throw new HttpError("Record not found").status(404)
    }
    return rec
}

export async function getOne(req: Request, res: Response) {
    res.json(await byId(+req.params.id))
}

export async function getAll(req: Request, res: Response) {
    res.json(await db.promise("all", "SELECT id, displayName, imgSrc, location, disabled FROM institutions"))
}

export async function startAuthorization(req: Request, res: Response) {

    const institution = await byId(+req.params.id)

    return smart(req, res).authorize({
        clientId: institution.clientId,
        scope: institution.scope,
        redirectUri: `/institutions/${institution.id}/redirect`,
        iss: institution.fhirUrl
    });
}

export async function completeAuthorization(req: Request, res: Response) {
    const client = await smart(req, res).ready();
    const { response } = await client.request({
        url: `/Patient/${client.patient.id}/$ehi-export`,
        method: "POST",
        includeResponse: true
    })

    const statusUrl = response.headers.get("Content-Location");

    const job = new Job({
        statusUrl,
        userId: 1
    })

    const linkUrl = response.headers.get("Link");

    if (linkUrl) {
        // If there is a patient-interaction link, get it so we can redirect the user there
        const [href, rel] = linkUrl.split(/\s*;\s*/);
        if (href && rel === 'rel="patient-interaction"') {
            job.set("customizeUrl", href)
        }
    }

    await job.save()

    const customizeUrl = job.get("customizeUrl")

    let redirectUrl = "/jobs"
    if (process.env.NODE_ENV !== "production") {
        redirectUrl = "http://localhost:3000/jobs"
    }
    if (customizeUrl) {
        let url = new URL(customizeUrl)
        url.searchParams.set("redirect", redirectUrl)
        res.redirect(url.href)
    } else {
        res.redirect(redirectUrl)
    }
}


router.get("/", authenticate, requireAuth("user", "admin"), asyncRouteWrap(getAll))
router.get("/:id", authenticate, requireAuth("user", "admin"), asyncRouteWrap(getOne))
router.get("/:id/launch", authenticate, requireAuth("user", "admin"), asyncRouteWrap(startAuthorization))
router.get("/:id/redirect", authenticate, requireAuth("user", "admin"), asyncRouteWrap(completeAuthorization))
