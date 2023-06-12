export interface Institution {
  // The id of the institution, for use in routing and uniqueness
  id: string;
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
 * The JSON representation of an export job
 */
export interface ExportJob {
  /**
   * Random 8 char hex job ID
   */
  id: string;

  userId: number;
  statusUrl: string
  readonly: boolean
  customizeUrl: string | null
  manifest: any

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
   * The JS timestamp showing when this job was completed, or `0` if it
   * hasn't been completed yet
   */
  completedAt: number;

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

/**
 * The JSON representation of an export job summary
 */
export interface ExportJobSummary {
  /**
   * Job ID
   */
  id: string// | number;

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
   * The JS timestamp showing when this job was completed, or `0` if it
   * hasn't been completed yet
   */
  completedAt: number;

  /**
   * Array of additional attachments which should be made available via
   * DocumentReference
   */
  attachments: fhir4.Attachment[];
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
 */
export type ExportJobStatus =
  | "awaiting-input"
  | "in-review"
  | "requested"
  | "retrieved"
  | "aborted"
  | "rejected";

export interface ExportJobInformationParameter {
  name: string;
  enabled: boolean;
  notes?: string;
  from?: string;
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
  name: string;
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
