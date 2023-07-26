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
  return `Started at ${formatDateTime(createdAt)}`;
}

// Format when a job was approved in a user-friendly way
export function displayApprovedDate(
  job: EHIApp.ExportJob | EHIApp.PatientExportJob
) {
  const { approvedAt } = job;
  if (approvedAt === null) return "";
  return `Completed ${formatDateTime(approvedAt)}`;
}

/**
 * A generic memoizer function for admin and patient job-lists
 * to check if incoming props contain a different job and require a re-render
 * @param prevProps
 * @param nextProps
 * @returns true if the jobs are equal, false otherwise
 */
export function jobEqualityMemoizer<
  T extends EHIApp.ExportJob | EHIApp.PatientExportJob
>(prevProps: { job: T }, nextProps: { job: T }) {
  return JSON.stringify(prevProps.job) === JSON.stringify(nextProps.job);
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
