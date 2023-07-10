declare namespace EHIApp {
  /**
   * Information associated with an authenticated user
   */
  export type AuthUser = {
    id: string;
    username: string;
  };

  export interface Institution {
    // The id of the institution, for use in routing and uniqueness
    id: number;
    // The name of the institution, for use in visual displays
    displayName: string;
    // Where the institution is located, represented as a one-line string
    location?: string;
    // A URL pointing to this institution's FHIR server
    fhirUrl: string;
    // Whether or not this institution should be displayed in the UI
    disabled: boolean;
  }

  /**
   * Can be:
   *
   * - `awaiting-input` - The user needs to fill in the form.
   *
   * - `requested` - After the form is submitted successfully no more actions
   *    are required by the user. FHIR bulk export is running, this is prior to admin approval
   *
   * - `retrieved` - FHIR Bulk export is done and the job is now being reviewed by admins
   *
   * - `approved` - FHIR Bulk export is done and the job has been approved;
   *    now accessible via ehi-export status requests
   *
   * - `aborted` - The admin or the patient aborted/canceled this export.
   *
   * - `rejected` - The admin rejected this export.
   *
   */
  export type ExportJobStatus =
    | "awaiting-input"
    | "requested"
    | "retrieved"
    | "approved"
    | "aborted"
    | "rejected";

  export interface ExportJobInformationParameter {
    // The display-friendly name associated with this parameter
    name: string;
    // Whether or not this parameter has been enabled by a form-submitter
    enabled: boolean;
    // Optional free-text commentary provided by users
    notes?: string;
    // Optional from-date to restrict parameter-based inclusion criteria.
    from?: string;
    // Optional to-date to restrict parameter-based inclusion criteria.
    to?: string;
  }

  export interface ExportJobInformationParameters {
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

  export interface ExportJobAuthorization {
    // The display-friendly name associated with this authorization
    name: string;
    // The value provided for this authorization, where strings are provided when free-text fields are provided
    // to users in their form interface.
    value: boolean | string;
  }

  export interface ExportJobAuthorizations {
    hiv?: ExportJobAuthorization;
    alcoholAndDrug?: ExportJobAuthorization;
    mentalHealth?: ExportJobAuthorization;
    confidential?: ExportJobAuthorization;
    domesticViolence?: ExportJobAuthorization;
    sexualAssault?: ExportJobAuthorization;
    genetic?: ExportJobAuthorization;
    other?: ExportJobAuthorization;
  }
  export interface ExportJob {
    /**
     * Random 8 char hex job ID
     */
    id: string;

    userId: number;
    statusUrl: string;
    customizeUrl: string | null;
    manifest: any;

    /**
     * The ID and humanized name of the patient
     */
    patient: {
      id: string;
      name: string;
    };
    /**
     * The job status
     */
    status: ExportJobStatus;

    /**
     * The JS timestamp showing when this job was created
     */
    createdAt: number;

    /**
     * The JS timestamp showing when this job was approved, or `null` if it
     * hasn't been completed yet
     */
    approvedAt: number | null;

    /**
     * Array of additional attachments which should be made available via
     * DocumentReference
     */
    attachments: fhir4.Attachment[];

    /**
     * Dictionary specifying what patient information should be exported as part of this job
     */
    parameters?: ExportJobInformationParameters;

    /**
     * Dictionary specifying what privileged topics should be exported as part of this job
     */
    authorizations?: ExportJobAuthorizations;
  }

  ////////////////////////////
  // Patient Specific Interfaces

  type PatientExportJobStatus = Extract<
    ExportJobStatus,
    "awaiting-input" | "approved" | "rejected"
  >;

  type PatientExportJob = Omit<
    ExportJob,
    "parameters" | "authorizations" | "status"
  > & {
    status: PatientExportJobStatus;
  };
}
