import { rmSync, statSync, writeFileSync } from "fs"
import { copyFile, mkdir, unlink } from "fs/promises"
import { basename, join } from "path"
import config from "../config"
import db from "../db"
import { HttpError } from "../errors"
import { downloadFile, getPrefixedFilePath, mkdirSyncRecursive, wait } from "../lib"
import { EHI } from "../types"


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
     * The humanized name of the patient who's data is exported. Note that this
     * is not available before the export is completed on the EHI server.
     */
    protected patientName: string | null = null;

    /**
     * The URL of the status endpoint fot this job
     */
    readonly statusUrl: string;

    /**
     * The URL of the customization form (if any) fot this job
     */
    protected customizeUrl: string;

    /**
     * The export job manifest if available
     */
    public manifest: EHI.ExportManifest | null;

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

    readonly directory: string

    public approvedAt: number | null = null;

    constructor(rec: EHI.ExportJobDbRecord) {
        this.id = rec.id
        this.userId = rec.userId
        this.patientId = rec.patientId
        this.patientName = rec.patientName
        this.statusUrl = rec.statusUrl || ""
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
        this.directory = join(config.jobsDir, this.id + "")
        this.approvedAt = rec.approvedAt
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
        tokenUri,
        approvedAt = null
    }: {
        userId: number
        patientId: string
        statusUrl: string
        customizeUrl?: string
        accessToken: string
        refreshToken: string
        tokenUri: string
        approvedAt?: number | null
    }) {
        const { lastID } = await db.promise(
            "run",
            `INSERT INTO "jobs" (userId, patientId, statusUrl, customizeUrl, accessToken, refreshToken, tokenUri, approvedAt, createdAt) values (?,?,?,?,?,?,?,?,?)`,
            [userId, patientId, statusUrl, customizeUrl, accessToken, refreshToken, tokenUri, approvedAt, Date.now()]
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

    // Recursive function for polling for updates to EHI-server's export jobs
    private async waitForExport(): Promise<Job> {

        let res = await this.request(true)(this.statusUrl)

        // Base Case 1: The export is complete, we can save and finish
        if (res.status === 200) {
            this.manifest = await res.json()
            return this.save()
        }

        // // Base Case 2: The export job was likely aborted, we should stop polling for updates
        // if (res.status === 404) {
        //     // TODO: Update _this_ instance of this job with new information
        //     return this
        // }

        // Export job is in progress, check again later
        if (res.status === 202) {
            await wait(config.statusCheckInterval)
            return this.waitForExport()
        }

        // Handle all other errors gracefully
        throw new HttpError(`Unexpected bulk status response ${res.status} ${res.statusText}`)
    }

    private async fetchExportedFiles(): Promise<Job> {
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

    private async fetchJobMetadata(): Promise<Job> {
        const url = this.manifest?.extension?.metadata
        if (url) {
            const remoteJobResponse = await this.request(true)(url)

            if (!remoteJobResponse.ok) {
                throw new HttpError("Failed fetching job metadata")
            }

            const remoteJob = await remoteJobResponse.json()

            this.parameters = remoteJob.parameters
            this.authorizations = remoteJob.authorizations
            this.patientName = remoteJob.patient.name
            await this.save()
        }
        return this
    }

    public async sync(): Promise<Job> {
        if (!this.status) {
            this.status = "requested"
            await this.save()
            await this.waitForExport()
            // TODO: If we want to abort requested jobs, we need to exit this loop gracefully
            // when the job is aborted. Depending on the timeout, the job might not exist on the EHI-server;
            // Even if it does, _this_ job isn't updated with the new status and needs to have some way 
            // of receiving the new updates (maybe a call to byID in the waitForExport if-404 block that 
            // uses object.assign to update `this`? 
            // // If the job was aborted, short-circuit the sync loop
            // console.log('in sync with status: ', this.status)
            // if(this.status === "aborted") return this
            // // Else, it was exported; finish local data tracking
            await this.fetchJobMetadata()
            await this.fetchExportedFiles()
            this.status = "in-review"
            await this.save()
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
            statusUrl: this.statusUrl,
            customizeUrl: this.customizeUrl,
            manifest: this.manifest ? JSON.stringify(this.manifest) : null,
            parameters: this.parameters ? JSON.stringify(this.parameters) : null,
            authorizations: this.authorizations ? JSON.stringify(this.authorizations) : null,
            attachments: this.attachments ? JSON.stringify(this.attachments) : null,
            status: this.status,
            patientName: this.patientName,
            approvedAt: this.approvedAt
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
                if (this.statusUrl) {
                    // Try to delete the remote job but ignore errors in case
                    // the remote job is no longer available
                    await this.request(true)(this.statusUrl, { method: "DELETE" }).catch(() => { })
                }
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
                name: this.patientName
            },
            status: this.status,
            createdAt: this.createdAt,
            approvedAt: this.approvedAt,
            attachments: this.attachments,
            parameters: this.parameters || {},
            authorizations: this.authorizations || {},
            statusUrl: this.statusUrl,
            customizeUrl: this.customizeUrl,
            manifest: this.manifest
        }
    }

    /**
     * Aborts a running export
     */
    public async abort() {
        if (this.status === "awaiting-input" || this.status === 'in-review' || this.status === "requested") {
            await this.request(true)(this.statusUrl, { method: "DELETE" })
            this.status = "aborted"
            await this.save()
        }
        return this
    }

    protected getAugmentedManifest(): EHI.ExportManifest | null {

        if (!this.attachments.length) {
            return this.manifest
        }

        const baseUrl = this.attachments[0].url!.replace(/\/jobs\/.*/, "")

        const result = {
            ...this.manifest,
            output: [...this.manifest!.output]
        }

        const url = `${baseUrl}/jobs/${this.id}/download/attachments.DocumentReference.ndjson`

        result.output = result.output.filter(x => x.url !== url)

        result.output.push({ type: "DocumentReference", url, count: this.attachments.length })

        writeFileSync(
            join(this.directory, "attachments.DocumentReference.ndjson"),
            JSON.stringify({
                resourceType: "DocumentReference",
                status: "current",
                subject: { reference: "Patient/" + this.patientId },
                content: this.attachments.map(x => ({ attachment: x })),
                meta: {
                    tag: [{
                        code: "ehi-export",
                        display: "generated as part of an ehi-export request"
                    }]
                }
            })
        )

        return result as EHI.ExportManifest
    }

    /**
     * Add results to a task (e.g., dragging a CSV file into the browser to
     * simulate the manual gathering of data from different underlying systems)
     */
    public async addAttachment(attachment: Express.Multer.File, baseUrl: string) {
        const src = join(__dirname, "../..", attachment.path)
        const dst = join(this.directory, "attachments")
        const path = getPrefixedFilePath(dst, attachment.originalname)
        const filename = basename(path)
        await mkdir(dst, { recursive: true });
        await copyFile(src, path);
        const entry = {
            title: filename,
            contentType: attachment.mimetype,
            size: attachment.size,
            url: `${baseUrl}/jobs/${this.id}/download/attachments/${filename}`
        }
        this.attachments.push(entry);
        this.manifest = this.getAugmentedManifest()
        await this.save()
        await unlink(src)
    }

    public async removeAttachment(fileName: string, baseUrl: string) {
        const dst = join(this.directory, "attachments", fileName)
        const url = `${baseUrl}/jobs/${this.id}/download/attachments/${fileName}`
        if (this.attachments.find(x => x.url === url) && statSync(dst, { throwIfNoEntry: false })?.isFile()) {
            await unlink(dst)
            this.attachments = this.attachments.filter(x => x.url !== url)
            this.manifest = this.getAugmentedManifest()
            await this.save()
        }
    }
}