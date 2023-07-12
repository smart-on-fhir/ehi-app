import { readFileSync, writeFileSync } from "fs";
// import { copyFile, mkdir, unlink } from "fs/promises";
import { basename, join } from "path";
import config from "../config";
import db from "../db";
import { HttpError } from "../errors";
import {
  downloadFile,
  getJobCustomizationUrl,
  getPrefixedFilePath,
  mkdirSyncRecursive,
  wait,
} from "../lib";
import { EHI } from "../types";

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
   * Custom attachments (if any)
   */
  protected attachments: fhir4.Attachment[];

  /**
   * Timestamp of creation
   */
  protected createdAt: number;

  public status: EHI.PatientExportJobStatus | null;

  protected accessToken: string;

  protected refreshToken: string;

  protected tokenUri: string;

  readonly directory: string;

  public approvedAt: number | null = null;

  constructor(rec: EHI.PatientExportJobDbRecord) {
    this.id = rec.id;
    this.userId = rec.userId;
    this.patientId = rec.patientId;
    this.patientName = rec.patientName;
    this.statusUrl = rec.statusUrl || "";
    this.customizeUrl = rec.customizeUrl || "";
    this.manifest = JSON.parse(rec.manifest || "null");
    this.attachments = JSON.parse(rec.attachments || "[]");
    this.createdAt = +new Date(rec.createdAt);
    this.accessToken = rec.accessToken;
    this.refreshToken = rec.refreshToken;
    this.tokenUri = rec.tokenUri;
    this.status = rec.status;
    this.directory = join(config.jobsDir, this.id + "");
    this.approvedAt = rec.approvedAt;
    mkdirSyncRecursive(this.directory);
  }

  public static async byId(id: number) {
    const rec = await db.promise("get", "SELECT * FROM jobs WHERE id = ?", id);
    if (!rec) {
      throw new HttpError("Job not found").status(404);
    }
    return new Job(rec);
  }

  public static async create({
    userId,
    patientId,
    statusUrl,
    customizeUrl,
    accessToken,
    refreshToken,
    tokenUri,
    approvedAt = null,
  }: {
    userId: number;
    patientId: string;
    statusUrl: string;
    customizeUrl?: string;
    accessToken: string;
    refreshToken: string;
    tokenUri: string;
    approvedAt?: number | null;
  }) {
    const { lastID } = await db.promise(
      "run",
      `INSERT INTO "jobs" (userId, patientId, statusUrl, customizeUrl, accessToken, refreshToken, tokenUri, approvedAt, createdAt) values (?,?,?,?,?,?,?,?,?)`,
      [
        userId,
        patientId,
        statusUrl,
        customizeUrl,
        accessToken,
        refreshToken,
        tokenUri,
        approvedAt,
        Date.now(),
      ]
    );
    return Job.byId(lastID);
  }

  // =========================================================================

  private request<T = any>(useAuth?: boolean) {
    return async (
      input: RequestInfo | URL,
      options: RequestInit = {}
    ): Promise<T> => {
      if (useAuth) {
        options.headers = {
          ...options.headers,
          authorization: "Bearer " + this.accessToken,
        };
      } else {
        // @ts-ignore
        delete options.headers?.authorization;
      }

      let res = await fetch(input, options);

      if (useAuth && res.status === 401) {
        await this.refresh();
        res = await fetch(input, {
          ...options,
          headers: {
            ...options.headers,
            authorization: "Bearer " + this.accessToken,
          },
        });
      }

      return res as T;
    };
  }

  // Recursive function for polling for updates to EHI-server's export jobs
  private async waitForExport(): Promise<Job> {
    let res = await this.request(true)(this.statusUrl);
    // Before we check for status codes
    // Check against headers to determine if we need to complete the form still
    const customizeUrl = getJobCustomizationUrl(res);
    if (customizeUrl !== "") {
      await wait(config.statusCheckInterval);
      return this.waitForExport();
    }

    // Base Case: The export is complete, we can save and finish
    if (res.status === 200) {
      this.manifest = await res.json();
      this.status = "approved";
      this.approvedAt = Date.now();
      return this.save();
    }

    // Export job is in progress, check again later
    if (res.status === 202) {
      // We might have been in an awaiting-input stage; if we aren't requested already, change status
      if (this.status !== "requested") {
        this.status = "requested";
        this.save();
      }
      await wait(config.statusCheckInterval);
      return this.waitForExport();
    }

    // TODO: Need to handle 4XX and 5XX
    if (res.status === 404) {
      // FIX: This can't be the best way to do this
      // Check to see if we've aborted the job in another thread
      const mostRecentJob = await Job.byId(this.id);
      if (mostRecentJob.status === "aborted") {
        this.status = "aborted";
        return this;
      } else {
        // Else, we have a 404; the job was deleted
        this.status = "deleted";
        return this.save();
      }
    }

    // Handle all other errors gracefully
    throw new HttpError(
      `Unexpected bulk status response ${res.status} ${res.statusText}`
    );
  }

  private async downloadAttachments(
    documentReference: fhir4.DocumentReference
  ): Promise<void> {
    // Create attachments directory
    const attachmentDir = join(this.directory, "attachments");
    mkdirSyncRecursive(attachmentDir);
    // Get attachments off that docref
    const attachments = documentReference.content.map((c) => c!.attachment);
    for (const attachment of attachments) {
      // Download each attachment to a new location
      const dst = getPrefixedFilePath(attachmentDir, attachment.title!);
      await downloadFile(attachment.url!, dst, {
        headers: {
          authorization: this.manifest!.requiresAccessToken
            ? "Bearer " + this.accessToken
            : undefined,
        },
      });
    }
  }

  private async fetchExportedFiles(): Promise<Job> {
    for (const file of this.manifest!.output) {
      // console.log(`Downloading ${file.type} file from ${file.url}`);
      const dst = getPrefixedFilePath(
        this.directory,
        basename(file.url.replace(/(\.ndjson)?$/, ".ndjson"))
      );
      await downloadFile(file.url, dst, {
        headers: {
          authorization: this.manifest!.requiresAccessToken
            ? "Bearer " + this.accessToken
            : undefined,
        },
      });
      // Check DocumentReference files to see if they contain ehi-export attachments to download
      if (file.type === "DocumentReference") {
        const downloadedFile = readFileSync(dst, "utf8");
        const documentReference: fhir4.DocumentReference =
          JSON.parse(downloadedFile);
        if (
          documentReference?.meta?.tag?.some((t) => t.code === "ehi-export")
        ) {
          console.log("is an ehi-export doc ref; should download attachments");
          // this.downloadAttachments(documentReference);
        }
      }
    }
    return this;
  }

  public async sync(): Promise<Job> {
    if (!this.status) {
      this.status = "awaiting-input";
      await this.save();
      // Side-effect: should change status
      await this.waitForExport();
      // @ts-ignore
      if (this.status === "approved") {
        await this.fetchExportedFiles();
        await this.save();
      }
    }

    return this;
  }

  private async refresh() {
    const { refreshToken, tokenUri } = this;
    const res = await fetch(tokenUri, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(
        refreshToken
      )}`,
    });

    if (!res.ok) {
      this.refreshToken = "";
      await this.save();
      throw new HttpError("Refreshing the access token failed!");
    }

    const tokenResponse: any = await res.json();
    this.refreshToken = tokenResponse.refresh_token;
    this.accessToken = tokenResponse.access_token;
    await this.save();
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
      attachments: this.attachments ? JSON.stringify(this.attachments) : null,
      status: this.status,
      patientName: this.patientName,
      approvedAt: this.approvedAt,
    };
    if (this.id) {
      await db.promise(
        "run",
        `UPDATE "jobs" SET ${Object.keys(params)
          .map((k) => k + "=?")
          .join(", ")} WHERE id=?`,
        [...Object.values(params), this.id]
      );
    } else {
      await db.promise(
        "run",
        `INSERT INTO "jobs" (${Object.keys(params).join(", ")})
                 VALUES (${Object.keys(params)
                   .map((k) => "?")
                   .join(", ")})`,
        Object.values(params)
      );
    }
    return this;
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      patient: {
        id: this.patientId,
        name: this.patientName,
      },
      status: this.status,
      createdAt: this.createdAt,
      approvedAt: this.approvedAt,
      attachments: this.attachments,
      statusUrl: this.statusUrl,
      customizeUrl: this.customizeUrl,
      manifest: this.manifest,
    };
  }

  /**
   * Aborts a running export
   */
  public async abort() {
    // TODO: Re-enable abort
    if (this.status === "requested") {
      await this.request(true)(this.statusUrl, { method: "DELETE" });
      this.status = "aborted";
      await this.save();
    }
    return this;
  }

  protected getAugmentedManifest(): EHI.ExportManifest | null {
    if (!this.attachments.length) {
      return this.manifest;
    }

    const baseUrl = this.attachments[0].url!.replace(/\/jobs\/.*/, "");

    const result = {
      ...this.manifest,
      output: [...this.manifest!.output],
    };

    const url = `${baseUrl}/jobs/${this.id}/download/attachments.DocumentReference.ndjson`;

    result.output = result.output.filter((x) => x.url !== url);

    result.output.push({
      type: "DocumentReference",
      url,
      count: this.attachments.length,
    });

    writeFileSync(
      join(this.directory, "attachments.DocumentReference.ndjson"),
      JSON.stringify({
        resourceType: "DocumentReference",
        status: "current",
        subject: { reference: "Patient/" + this.patientId },
        content: this.attachments.map((x) => ({ attachment: x })),
        meta: {
          tag: [
            {
              code: "ehi-export",
              display: "generated as part of an ehi-export request",
            },
          ],
        },
      })
    );

    return result as EHI.ExportManifest;
  }
}
