// import Path, { basename } from "path"
// import smart from "fhirclient"
import { rmSync } from "fs";
import { copyFile, mkdir, unlink } from "fs/promises";
import { basename, join } from "path";
import config from "./config";
import db from "./db"
import { HttpError } from "./errors"
import { downloadFile, getPrefixedFilePath, mkdirSyncRecursive, wait } from "./lib";
import { EHI } from "./types"
// import { Request, Response } from "express"
// import { getPrefixedFilePath, getRequestBaseURL, getStorage, wait } from "./lib"
// import { copyFile, mkdir, unlink } from "fs/promises"

export default class Job {

    /**
     * The ID of this job in the database (or null for new instances that are
     * not yet inserted in DB)
     */
    protected id: number;

    /**
     * The ID of the patient who created this job (note that this is not the
     * patient, although it will probably be the same person)
     */
    readonly userId: number;

    /**
     * The ID of the patient who's data is exported
     */
    readonly patientId: string | number;

    /**
     * The URL of the status endpoint fot this job
     */
    readonly statusUrl: string;

    /**
     * This flag tells us that the jib is immutable. Only used for some
     * pre-inserted jobs for demo purposes
     */
    protected readonly: boolean;

    /**
     * The URL of the customization form (if any) fot this job
     */
    protected customizeUrl: string;

    /**
     * The export job manifest if available
     */
    protected manifest: EHI.ExportManifest | null;

    /**
     * Customization parameters (if any)
     */
    protected parameters: EHI.ExportJobInformationParameters | null;

    /**
     * Authorizations given (if any)
     */
    protected authorizations: EHI.ExportJobAuthorizations | null;

    /**
     * Custom attachments (if any)
     */
    protected attachments: fhir4.Attachment[];

    /**
     * Timestamp of creation
     */
    protected createdAt: number;

    public status: EHI.ExportJobStatus | null;

    protected accessToken: string

    protected refreshToken: string

    protected tokenUri: string

    protected directory: string

    constructor(rec: EHI.ExportJobDbRecord) {
        this.id = rec.id
        this.userId = rec.userId
        this.patientId = rec.patientId
        this.statusUrl = rec.statusUrl || ""
        this.readonly = !!rec.readonly
        this.customizeUrl = rec.customizeUrl || ""
        this.manifest = JSON.parse(rec.manifest || "null")
        this.parameters = JSON.parse(rec.parameters || "null")
        this.authorizations = JSON.parse(rec.authorizations || "null")
        this.attachments = JSON.parse(rec.attachments || "[]")
        this.createdAt = +new Date(rec.createdAt)
        this.accessToken = rec.accessToken
        this.refreshToken = rec.refreshToken
        this.tokenUri = rec.tokenUri
        this.status = rec.status
        this.directory = join(__dirname, "jobs", this.id + "")
        mkdirSyncRecursive(this.directory)
    }

    public static async byId(id: number) {
        const rec = await db.promise("get", "SELECT * FROM jobs WHERE id = ?", id)
        if (!rec) {
            throw new HttpError("Job not found").status(404)
        }
        return new Job(rec)
    }

    public static async create({
        userId,
        patientId,
        statusUrl,
        customizeUrl,
        accessToken,
        refreshToken,
        tokenUri
    }: {
        userId: number
        patientId: string
        statusUrl: string
        customizeUrl?: string
        accessToken: string
        refreshToken: string
        tokenUri: string
    }) {
        const { lastID } = await db.promise(
            "run",
            `INSERT INTO "jobs" (userId, patientId, statusUrl, customizeUrl, accessToken, refreshToken, tokenUri) values (?,?,?,?,?,?,?)`,
            [userId, patientId, statusUrl, customizeUrl, accessToken, refreshToken, tokenUri]
        )
        return Job.byId(lastID)
    }

    // =========================================================================

    private request<T = any>(useAuth?: boolean) {
        return async (input: RequestInfo | URL, options: RequestInit = {}): Promise<T> => {
            if (useAuth) {
                options.headers = {
                    ...options.headers,
                    authorization: "Bearer " + this.accessToken
                }
            } else {
                // @ts-ignore
                delete options.headers?.authorization
            }

            let res = await fetch(input, options)

            if (useAuth && res.status === 401) {
                await this.refresh()
                res = await fetch(input, {
                    ...options,
                    headers: {
                        ...options.headers,
                        authorization: "Bearer " + this.accessToken
                    }
                })
            }

            return res as T
        }
    }

    private async waitForExport(): Promise<Job> {

        let res = await this.request(true)(this.statusUrl)

        if (res.status == 200) {
            this.manifest = await res.json()
            this.status = "in-review"
            return this.save()
        }

        if (res.status == 202) {
            await wait(config.statusCheckInterval)
            return this.waitForExport()
        }

        throw new HttpError(`Unexpected bulk status response ${res.status} ${res.statusText}`)
    }

    private async fetchExport(): Promise<Job> {
        for (const file of this.manifest!.output) {
            // console.log(`Downloading ${file.type} file from ${file.url}`)
            const dst = getPrefixedFilePath(this.directory, basename(file.url.replace(/(\.ndjson)?$/, ".ndjson")))
            await downloadFile(file.url, dst, {
                headers: {
                    "authorization": this.manifest!.requiresAccessToken ? "Bearer " + this.accessToken : undefined
                }
            })
        }
        return this
    }

    public async sync(): Promise<Job> {
        if (!this.status) {
            this.status = "requested"
            await this.save()
            await this.waitForExport()
            await this.fetchExport()
        }

        return this
    }

    private async refresh() {
        const { refreshToken, tokenUri } = this
        const res = await fetch(tokenUri, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`
        })

        if (!res.ok) {
            this.refreshToken = "";
            await this.save()
            throw new HttpError("Refreshing the access token failed!")
        }

        const tokenResponse: any = await res.json()
        this.refreshToken = tokenResponse.refresh_token
        this.accessToken = tokenResponse.access_token
        await this.save()
        return this;
    }

    // =========================================================================

    public async save() {
        const params = {
            userId: this.userId,
            patientId: this.patientId,
            readonly: this.readonly,
            statusUrl: this.statusUrl,
            customizeUrl: this.customizeUrl,
            manifest: this.manifest ? JSON.stringify(this.manifest) : null,
            parameters: this.parameters ? JSON.stringify(this.parameters) : null,
            authorizations: this.authorizations ? JSON.stringify(this.authorizations) : null,
            attachments: this.attachments ? JSON.stringify(this.attachments) : null,
            status: this.status
        }
        if (this.id) {
            await db.promise(
                "run",
                `UPDATE "jobs" SET ${Object.keys(params).map(k => k + "=?").join(", ")} WHERE id=?`,
                [...Object.values(params), this.id]
            )
        } else {
            await db.promise(
                "run",
                `INSERT INTO "jobs" (${Object.keys(params).join(", ")})
                 VALUES (${Object.keys(params).map(k => "?").join(", ")})`,
                Object.values(params)
            )
        }
        return this
    }

    public async destroy() {
        if (this.id) {
            await db.promise("run", "BEGIN")
            try {
                await db.promise("run", "DELETE FROM jobs WHERE id=?", [this.id])
                rmSync(this.directory, { force: true, recursive: true })
            } catch (ex) {
                console.error(ex)
                await db.promise("run", "ROLLBACK")
                throw new Error(`Unable to delete  job with id jobs/${this.id}/`)
            }
            await db.promise("run", "COMMIT")
        }
        return this
    }

    public toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            patient: {
                id: this.patientId,
                name: "John Doe" // TODO:
            },
            status: this.status,
            createdAt: this.createdAt,
            completedAt: 0,// TODO:
            attachments: this.attachments,
            parameters: this.parameters || {},
            authorizations: this.authorizations || {},
            statusUrl: this.statusUrl,
            readonly: this.readonly,
            customizeUrl: this.customizeUrl,
            manifest: this.manifest, // || {}
        }
    }

    public async download() { }

    /**
     * Aborts a running export and deletes the job. Only available for jobs in
     * "requested" state.
     */
    // public async abort() {
    //     if (this.status !== "requested") {
    //         throw new HttpError('Only jobs in "requested" state can be aborted').status(400)
    //     }
    //     if (this.statusUrl) {
    //         await fetch(this.statusUrl, { method: "DELETE" }) // TODO: Bearer auth
    //     }
    //     await this.destroy()
    //     return this;
    // }

    /**
     * Add results to a task (e.g., dragging a CSV file into the browser to
     * simulate the manual gathering of data from different underlying systems)
     */
    public async addAttachment(attachment: Express.Multer.File, baseUrl: string) {
        const src = join(__dirname, "..", attachment.path)
        const dst = join(this.directory, "attachments")
        const path = getPrefixedFilePath(dst, attachment.originalname)
        const filename = basename(path)
        await mkdir(dst, { recursive: true });
        await copyFile(src, path);
        this.attachments.push({
            title: filename,
            contentType: attachment.mimetype,
            size: attachment.size,
            url: `${baseUrl}/jobs/${this.id}/download/attachments/${filename}`
        });
        await this.save()
        await unlink(src)
    }

    public async removeAttachment(fileName: string) {
        this.attachments = this.attachments.filter(x => !x.url!.endsWith(`/${this.id}/download/attachments/${fileName}`))
        await this.save()
    }
}