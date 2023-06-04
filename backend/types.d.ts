import { Request } from "express-serve-static-core";

declare namespace EHI {

    interface UserRequest extends Request {
        user?: User
    }

    interface AuthenticatedRequest extends Request {
        user: User
    }

    interface User {
        id: number
        role: "admin" | "user"
        username: string
        password: string
        lastLogin: number | null
        sid: string | null
        session: string | null
    }

    interface ExportManifest {
        transactionTime: string
        requiresAccessToken: boolean
        output: ExportManifestFileEntry[]
        error: any[]
    }

    interface ExportManifestFileEntry {
        type: string
        url: string
        count?: number
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
    type ExportJobStatus = "awaiting-input" |
        "in-review" |
        "requested" |
        "retrieved" |
        "aborted" |
        "rejected";

    /**
     * The JSON representation of an export job
     */
    interface ExportJob {

        /**
         * Random 8 char hex job ID  
         */
        id: string

        /**
         * The ID of the exported patient
         * @deprecated Use `patient.id` instead
         */
        // patientId: string

        /**
         * The ID and humanized name of the patient
         */
        patient: {
            id: string
            name: string
        }

        /**
         * The bulk data export manifest if available. This will be null until
         * the export is approved and started (until it enters "requested" state) 
         */
        manifest: ExportManifest | null

        /**
         * The job status
         */
        status: ExportJobStatus

        /**
         * The JS timestamp showing when this job was created
         */
        createdAt: number

        /**
         * The JS timestamp showing when this job was completed, or `0` if it
         * hasn't been completed yet
         */
        completedAt: number | null

        /**
         * Array of additional attachments which should be made available via
         * DocumentReference
         */
        attachments: fhir4.Attachment[],

        parameters?: ExportJobInformationParameters,

        authorizations?: ExportJobAuthorizations
    }

    interface ExportJobDbRecord {
        id: number
        json: string
        userId: number
        readonly: boolean | 0 | 1
        statusUrl: string
        customizeUrl: string | null
    }

    interface ExportJobInformationParameter {
        name: string
        enabled: boolean
        notes?: string
        from?: string | false
        to?: string | false
        group?: number
    }

    interface ExportJobInformationParameters {
        medicalRecord?: ExportJobInformationParameter,
        visits?: ExportJobInformationParameter,
        dischargeSummary?: ExportJobInformationParameter,
        labs?: ExportJobInformationParameter,
        operative?: ExportJobInformationParameter,
        pathology?: ExportJobInformationParameter,
        radiation?: ExportJobInformationParameter,
        radiology?: ExportJobInformationParameter,
        photographs?: ExportJobInformationParameter,
        billing?: ExportJobInformationParameter,
        other?: ExportJobInformationParameter
    }

    interface ExportJobAuthorization {
        name: string
        value: boolean | string
    }

    interface ExportJobAuthorizations {
        hiv?: ExportJobAuthorization,
        alcoholAndDrug?: ExportJobAuthorization,
        mentalHealth?: ExportJobAuthorization,
        confidential?: ExportJobAuthorization,
        domesticViolence?: ExportJobAuthorization,
        sexualAssault?: ExportJobAuthorization,
        genetic?: ExportJobAuthorization,
        other?: ExportJobAuthorization
    }

    interface Attachment {

        /**
         * Mime type of the content, with charset etc.
         */
        contentType: string

        /**
         * Data inline, base64ed
         */
        data?: string

        /**
         * Uri where the data can be found
         */
        url?: string

        /**
         * Number of bytes of content (if url provided)
         */
        size: number
    }

}

// export as namespace EHI
