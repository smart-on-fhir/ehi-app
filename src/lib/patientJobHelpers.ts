import { formatDateTime, request } from ".";
import pkg from "../../package.json";

export function getExportJobLink(id: string) {
  if (process.env.NODE_ENV === "production") {
    return `/api/patientJobs/${id}/download`;
  }
  return `${pkg.proxy}/api/patientJobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.ExportJob[]> {
  return request<EHIApp.ExportJob[]>("/api/patientJobs", {
    signal,
  });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/patientJobs/${id}`, { signal });
}

export async function abortExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/patientJobs/${id}/abort`, {
    method: "post",
    signal,
  });
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

// Format when a job was created in a user-friendly way
export function displayCreatedDate(job: EHIApp.ExportJob) {
  const { createdAt } = job;
  return `Created ${formatDateTime(createdAt)}`;
}

// Format when a job was approved in a user-friendly way
export function displayApprovedDate(job: EHIApp.ExportJob) {
  const { approvedAt } = job;
  if (approvedAt === null) return "";
  return `Completed ${formatDateTime(approvedAt)}`;
}
