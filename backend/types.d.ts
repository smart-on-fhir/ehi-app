import { Request } from "express-serve-static-core";

// export as namespace EHI

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
   * - `awaiting-input` - The user needs to fill in the form.
   *
   * - `in-review` - After the form is submitted successfully no more actions
   *   are required by the user. Then the job switches to "in-review" status,
   *   meaning that it is waiting for the admin to approve or reject the export.
   *
   * - `requested` - After the export is approved by the admin and while the
   *   data is being exported.
   *
   * - `retrieved` - All the data transmitted to its destination.
   *
   * - `aborted` - The admin or the patient aborted/canceled this export.
   *
   * - `rejected` - The admin rejected this export.
   *
   *
   * **Note** that jobs have certain lifetime. Once they expire they will be
   * deleted within the next `config.jobCleanupMinutes` minutes:
   *
   * - `awaiting-input` - Does not expire
   * - `in-review`      - Expire after `config.jobMaxLifetimeMinutes`
   * - `requested`      - Expire after `config.jobMaxLifetimeMinutes`
   * - `retrieved`      - Expire after `config.jobMaxLifetimeMinutes`
   * - `aborted`        - Expire immediately
   * - `rejected`       - Expire immediately
   */
  type ExportJobStatus =
    | "awaiting-input"
    | "requested"
    | "retrieved"
    | "aborted"
    | "approved"
    | "rejected";
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

    parameters?: ExportJobInformationParameters;

    authorizations?: ExportJobAuthorizations;
  }

  interface ExportJobInformationParameter {
    name: string;
    enabled: boolean;
    notes?: string;
    from?: string | false;
    to?: string | false;
    group?: number;
  }

  interface ExportJobInformationParameters {
    medicalRecord?: ExportJobInformationParameter;
    visits?: ExportJobInformationParameter;
    dischargeSummary?: ExportJobInformationParameter;
    labs?: ExportJobInformationParameter;
    operative?: ExportJobInformationParameter;
    pathology?: ExportJobInformationParameter;
    radiation?: ExportJobInformationParameter;
    radiology?: ExportJobInformationParameter;
    photographs?: ExportJobInformationParameter;
    billing?: ExportJobInformationParameter;
    other?: ExportJobInformationParameter;
  }

  interface ExportJobAuthorization {
    name: string;
    value: boolean | string;
  }

  interface ExportJobAuthorizations {
    hiv?: ExportJobAuthorization;
    alcoholAndDrug?: ExportJobAuthorization;
    mentalHealth?: ExportJobAuthorization;
    confidential?: ExportJobAuthorization;
    domesticViolence?: ExportJobAuthorization;
    sexualAssault?: ExportJobAuthorization;
    genetic?: ExportJobAuthorization;
    other?: ExportJobAuthorization;
  }

  interface ExportJobDbRecord {
    id: number;
    userId: number;
    patientId: string | number;
    statusUrl: string | null;
    customizeUrl: string | null;
    manifest: string | null; // JSON -> ExportManifest
    parameters: string | null; // JSON -> ExportJobInformationParameters
    authorizations: string | null; // JSON -> ExportJobAuthorizations
    attachments: string | null; // JSON -> Attachment[]
    createdAt: number;
    accessToken: string;
    refreshToken: string;
    tokenUri: string;
    status: ExportJobStatus | null;
    patientName: string | null;
    approvedAt: number | null;
  }

  ////////////////////////////
  // Patient Specific Interfaces

  type PatientExportJobStatus =
    | Extract<
      ExportJobStatus,
      "awaiting-input" | "requested" | "approved" | "aborted"
    >
    | "deleted";

  // Note: Not using simple Omit because we need status to change from type ExportJobStatus to PatientExportJobStatus
  type PatientExportJob = Omit<
    ExportJob,
    "parameters" | "authorizations" | "status"
  > & { status: PatientExportJobStatus };

  // Note: Not using simple Omit because we need status to change from type ExportJobStatus to PatientExportJobStatus
  type PatientExportJobDbRecord = Omit<
    ExportJobDbRecord,
    "parameters" | "authorizations" | "status"
  > & { status: PatientExportJobStatus };

  ///////////
  // Unused TODO: DELETE?
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
