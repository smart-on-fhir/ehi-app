import { request } from ".";
import pkg from "../../package.json";

export function getExportJobLink(id: string) {
  // Needs the actual server URL since this is used in an <a> tag, not in the request library
  // return `${process!.env!.REACT_APP_EHI_SERVER}/api/jobs/${id}/download`;
  if (process.env.NODE_ENV === "production") {
    return `/api/jobs/${id}/download`;
  }
  return `${pkg.proxy}/api/jobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.ExportJobSummary[]> {
  return request<EHIApp.ExportJobSummary[]>("/api/jobs", { signal });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}`, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}/${newStatus}`, {
    method: "post",
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}`, {
    method: "delete",
    signal,
  });
}

export function canJobChangeStatus(
  job: EHIApp.ExportJob | EHIApp.ExportJobSummary
): boolean {
  return (
    job.status === "awaiting-input" ||
    job.status === "in-review" ||
    job.status === "requested"
  );
}
