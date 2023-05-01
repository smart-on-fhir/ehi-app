import Client from "fhirclient/lib/Client";
import { fhirclient } from "fhirclient/lib/types";

export interface SMARTContextInterface {
  client: Client | null;
  error: Error | null;
  loading: boolean;
  startAuthorization: (options?: fhirclient.AuthorizeParams) => Promise<any>;
  completeAuthorization: () => Promise<Client | void>;
}

export interface Institution {
  // The name of the institution, for use in visual displays
  displayName: string;
  // A URL pointing to a small, square image to be used as the institution's logo
  imgUrl: string;
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

  /**
   * The ID of the exported patient
   */
  patientId: string;

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
   * Random 8 char hex job ID
   */
  id: string;

  /**
   * The ID of the exported patient
   */
  patientId: string;

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
