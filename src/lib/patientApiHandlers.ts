import { request } from ".";
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
