import { formatDateTime } from ".";

// Prepare a link to the customizeUrl accompanied by redirect information
export function getCustomizeUrl(
  job: EHIApp.ExportJob | EHIApp.PatientExportJob
) {
  return job.customizeUrl
    ? `${job.customizeUrl}&redirect=${
        window.location.origin + window.location.pathname
      }`
    : "";
}

// Format when a job was created in a user-friendly way
export function displayCreatedDate(
  job: EHIApp.ExportJob | EHIApp.PatientExportJob
) {
  const { createdAt } = job;
  return `Created ${formatDateTime(createdAt)}`;
}

// Format when a job was approved in a user-friendly way
export function displayApprovedDate(
  job: EHIApp.ExportJob | EHIApp.PatientExportJob
) {
  const { approvedAt } = job;
  if (approvedAt === null) return "";
  return `Completed ${formatDateTime(approvedAt)}`;
}

///////////////////
// Admin only

// Determines if a job can change given its status, useful for determining if we should check for changes to this job
export function canJobChangeStatus(job: EHIApp.ExportJob): boolean {
  return (
    job.status === "awaiting-input" ||
    job.status === "retrieved" ||
    job.status === "requested"
  );
}

// Format available patient information in a user-friendly way
export function displayPatientInformation(job: EHIApp.ExportJob) {
  const { patient } = job;
  return `Patient ${
    patient.name !== "" && patient.name !== null
      ? patient.name
      : "#" + patient.id
  }`;
}
