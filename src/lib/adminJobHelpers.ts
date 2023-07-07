import { formatDateTime, request } from ".";
import pkg from "../../package.json";

const baseUrl = process.env.REACT_APP_EHI_SERVER;

export function getExportJobLink(id: string) {
  return `${baseUrl}/admin/jobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.ExportJob[]> {
  return request<EHIApp.ExportJob[]>(`${baseUrl}/admin/jobs`, {
    signal,
    credentials: "include",
  });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    signal,
    credentials: "include",
  });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject",
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/${newStatus}`, {
    method: "post",
    signal,
    credentials: "include",
  });
}

export async function abortExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/abort`, {
    method: "post",
    credentials: "include",
    signal,
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    method: "delete",
    credentials: "include",
    signal,
  });
}

// Determines if a job can change given its status, useful for determining if we should check for changes to this job
export function canJobChangeStatus(job: EHIApp.ExportJob): boolean {
  return (
    job.status === "awaiting-input" ||
    job.status === "in-review" ||
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
