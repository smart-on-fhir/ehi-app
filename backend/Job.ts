import db from "./db";
import { HttpError } from "./errors";
import { EHI } from "./types";

export default class Job {

    protected attributes: EHI.ExportJob;
    protected id: number | null;
    protected userId: number | null;
    protected readonly: boolean;
    protected statusUrl: string;
    protected customizeUrl: string;

    constructor(rec: Partial<EHI.ExportJobDbRecord> = {}) {
        this.attributes = JSON.parse(rec.json || "{}");
        this.id = rec.id || null;
        this.userId = rec.userId || null;
        this.readonly = !!rec.readonly;
        this.statusUrl = rec.statusUrl || "";
        this.customizeUrl = rec.customizeUrl || "";
    }

    public async save() {
        if (this.id) {
            await db.promise(
                "run",
                `UPDATE "jobs" SET json=?, userId=?, readonly=?, statusUrl=?,
                customizeUrl=? WHERE id=?`,
                [
                    JSON.stringify(this.attributes),
                    this.userId,
                    this.readonly,
                    this.statusUrl,
                    this.customizeUrl,
                    this.id
                ]
            )
        } else {
            await db.promise(
                "run",
                `INSERT INTO "jobs" (json, userId, readonly, statusUrl, customizeUrl)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    JSON.stringify(this.attributes),
                    this.userId,
                    this.readonly,
                    this.statusUrl,
                    this.customizeUrl
                ]
            )
        }
        return this
    }

    public async destroy() {
        if (this.id) {
            await db.promise("run", "DELETE FROM jobs WHERE id=?", [this.id])
        }
        return this
    }

    public toJSON() {
        return this.attributes
    }

    public async download() { }

    public async approve() {
        if (this.attributes.status !== "in-review") {
            throw new HttpError('Only "in-review" exports can be approved').status(400)
        }
        this.attributes.status = "requested"
        await this.save()
        return this
    }

    /**
     * Switches status to "rejected". This is only available for jobs in
     * "in-review" or "awaiting-input" state.
     */
    public async reject() {
        if (this.attributes.status !== "in-review" && this.attributes.status !== "awaiting-input") {
            throw new HttpError('Only "in-review" and "awaiting-input" exports can be rejected').status(400)
        }
        this.attributes.status = "rejected"
        await this.save()
        return this;
    }

    /**
     * Aborts a running export and deletes the job. Only available for jobs in
     * "requested" state.
     */
    public async abort() {
        if (this.attributes.status !== "requested") {
            throw new HttpError('Only jobs in "requested" state can be aborted').status(400)
        }
        if (this.statusUrl) {
            await fetch(this.statusUrl, { method: "DELETE" }) // TODO: Bearer auth
        }
        await this.destroy()
        return this;
    }

    public async addAttachments() { }
    public async removeAttachments() { }
}