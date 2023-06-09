import smart from "fhirclient"
import express, { Request, Response } from "express"
import Job from "./Job"
import db from "./db"
import { HttpError } from "./errors"
import { asyncRouteWrap } from "./lib"
import { authenticate, requireAuth } from "./auth"
import { EHI } from "./types"


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
    res.json(await db.promise("all", "SELECT id, displayName, location, disabled FROM institutions"))
}

function getStorage(req: Request) {
    return {
        async set(key: string, value: any) {
            const user = (req as EHI.UserRequest).user!
            const session = JSON.parse(user.session || "{}")
            session[key] = value
            user.session = JSON.stringify(session)
            await db.promise("run", `update "users" set "session"=? where id=?`, [user.session, user.id])
        },
        async get(key: string) {
            const user = (req as EHI.UserRequest).user!
            const session = JSON.parse(user.session || "{}")
            return session[key]
        },
        async unset(key: string) {
            const user = (req as EHI.UserRequest).user!
            const session = JSON.parse(user.session || "{}")
            if (session.hasOwnProperty(key)) {
                delete session[key]
                user.session = JSON.stringify(session)
                await db.promise("run", `update "users" set "session"=? where "id"=?`, [user.session, user.id])
                return true
            }
            return false
        },
        async clear() {
            const user = (req as EHI.UserRequest).user!
            await db.promise("run", `update "users" set "session"=? where "id"=?`, ['{}', +user.id])
        }
    }
}

export async function startAuthorization(req: Request, res: Response) {
    const institution = await byId(+req.params.id)
    const storage = getStorage(req)
    await storage.clear()
    return smart(req, res, getStorage(req)).authorize({
        clientId: institution.clientId,
        scope: institution.scope,
        redirectUri: `/api/institutions/${institution.id}/redirect`,
        iss: institution.fhirUrl
    });
}

export async function completeAuthorization(req: Request, res: Response) {
    const client = await smart(req, res, getStorage(req)).ready();
    const { response } = await client.request({
        url: `/Patient/${client.patient.id}/$ehi-export`,
        method: "POST",
        includeResponse: true
    })

    const statusUrl = response.headers.get("Content-Location");

    const job = new Job({
        statusUrl,
        status: 'awaiting-input',
        userId: (req as EHI.AuthenticatedRequest).user.id,
        json: JSON.stringify({ 
            patient: {
                id: client.patient.id!,
                // TODO: Fetch the patient to get their name? Perhaps we can use the
                // name of out current user here?
                name: "John Doe (TODO)"
            }
        })
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
        redirectUrl = "http://127.0.0.1:3000/jobs"
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
