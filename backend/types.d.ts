import { Request } from "express-serve-static-core";

declare namespace EHI {
  interface UserRequest extends Request {
    user?: User;
  }

  interface AuthenticatedRequest extends Request {
    user: User;
  }

  interface User {
    id: number;
    username: string;
    password: string;
    lastLogin: number | null;
    sid: string | null;
    session: string | null;
  }

  interface ExportManifest {
    transactionTime: string;
    requiresAccessToken: boolean;
    output: ExportManifestFileEntry[];
    error: any[];
    extension?: Record<string, string>;
  }

  interface ExportManifestFileEntry {
    type: string;
    url: string;
    count?: number;
  }

  /**
   * Can be:
   *
   * - `requested` - After the export is approved by the admin and while the
   *   data is being exported.
   *
   * - `approved` - All the data transmitted to its destination.
   *
   * - `aborted` - The admin or the patient aborted/canceled this export.
   *
   * - `rejected` - The admin rejected this export.
   *
   *
   * **Note** that jobs have certain lifetime. Once they expire they will be
   * deleted within the next `config.jobCleanupMinutes` minutes:
   *
   * - `requested`      - Expire after `config.jobMaxLifetimeMinutes`
   * - `approved`      - Expire after `config.jobMaxLifetimeMinutes`
   * - `aborted`        - Expire immediately
   * - `rejected`       - Expire immediately
   */
  type ExportJobStatus = "requested" | "approved" | "aborted" | "rejected";

  /**
   * The JSON representation of an export job
   */
  interface ExportJob {
    /**
     * Random 8 char hex job ID
     */
    id: string;

    /**
     * The ID of the exported patient
     * @deprecated Use `patient.id` instead
     */
    // patientId: string

    /**
     * The ID and humanized name of the patient
     */
    patient: {
      id: string;
      name: string;
    };

    /**
     * The bulk data export manifest if available. This will be null until
     * the export is approved and started (until it enters "requested" state)
     */
    manifest: ExportManifest | null;

    /**
     * The job status
     */
    status: ExportJobStatus;

    /**
     * The JS timestamp showing when this job was created
     */
    createdAt: number;

    /**
     * The JS timestamp showing when this job was reviewed, or `null` if it
     * hasn't been reviewed yet
     */
    approvedAt: number | null;

    /**
     * Array of additional attachments which should be made available via
     * DocumentReference
     */
    attachments: fhir4.Attachment[];
  }

  interface ExportJobDbRecord {
    id: number;
    userId: number;
    patientId: string | number;
    statusUrl: string | null;
    customizeUrl: string | null;
    manifest: string | null; // JSON -> ExportManifest
    attachments: string | null; // JSON -> Attachment[]
    createdAt: number;
    accessToken: string;
    refreshToken: string;
    tokenUri: string;
    status: ExportJobStatus | null;
    patientName: string | null;
    approvedAt: number | null;
  }

  interface Attachment {
    /**
     * Mime type of the content, with charset etc.
     */
    contentType: string;

    /**
     * Data inline, base64ed
     */
    data?: string;

    /**
     * Uri where the data can be found
     */
    url?: string;

    /**
     * Number of bytes of content (if url provided)
     */
    size: number;
  }
}

// export as namespace EHI
