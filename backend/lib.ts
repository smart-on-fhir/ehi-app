
import Path from "path"
import https from "https"
import http, { IncomingMessage, RequestOptions } from "http"
import { statSync, createWriteStream, existsSync, mkdirSync } from "fs"
import { EHI } from "./types"
import db from "./db"
import {
    NextFunction,
    Request,
    Response as ExpressResponse,
    RequestHandler
} from "express"


/**
 * Given a request object, returns its base URL
 */
export function getRequestBaseURL(req: Request) {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    return protocol + "://" + host;
}

/**
 * Given an ehi-export response, return a link to customization form if one exists,
 * Otherwise, return empty string
 */
export function getJobCustomizationUrl(response: Response): string {
    const linkUrl = response.headers.get("Link");

    if (linkUrl) {
        // If there is a patient-interaction link, get it so we can redirect the user there
        const [href, rel] = linkUrl.split(/\s*;\s*/);
        if (href && rel === 'rel="patient-interaction"') {
            return href;
        }
    }
    return ''
}

/**
 * Creates and returns a route-wrapper function that allows for using an async
 * route handlers without try/catch.
 */
export function asyncRouteWrap(fn: RequestHandler) {
    return (req: Request, res: ExpressResponse, next: NextFunction) => Promise.resolve(
        fn(req, res, next)
    ).catch(next);
}

export function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function getPrefixedFilePath(destination: string, fileName: string) {
    let dst = Path.join(destination, fileName), counter = 0;
    while (statSync(dst, { throwIfNoEntry: false })?.isFile()) {
        dst = Path.join(destination, ++counter + "." + fileName)
    }
    return dst
}

export function getStorage(req: Request) {
    return {
        async set(key: string, value: any) {
            const user = (req as EHI.UserRequest).user!
            const session = JSON.parse(user.session || "{}")
            session[key] = value
            user.session = JSON.stringify(session)
            await db.promise("run", `update "sessions" set "session"=? where "id"=?`, [user.session, user.sid])
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
                await db.promise("run", `update "sessions" set "session"=? where "id"=?`, [user.session, user.sid])
                return true
            }
            return false
        },
        async clear() {
            const user = (req as EHI.UserRequest).user!
            await db.promise("run", `update "sessions" set "session"=? where "id"=?`, ['{}', user.sid])
        }
    }
}

export function downloadFile(url: string, destination: string, options: RequestOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const fileStream = createWriteStream(destination);

        const request = protocol.get(url, options, (response: IncomingMessage) => {

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`));
                return;
            }

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (error: Error) => {
                reject(error);
            });
        });

        request.on('error', (error: Error) => {
            reject(error);
        });
    });
}

export function mkdirSyncRecursive(directoryPath: string) {
    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
    }
}
