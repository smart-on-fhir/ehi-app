import { request } from "../lib";
import pkg from "../../package.json";

export function getExportJobLink(id: string) {
  if (process.env.NODE_ENV === "production") {
    return `/api/jobs/${id}/download`;
  }
  return `${pkg.proxy}/api/jobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob[]> {
  return request<EHIApp.PatientExportJob[]>("/api/jobs", {
    signal,
  });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}`, { signal });
}

export async function abortExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}/abort`, {
    method: "post",
    signal,
  });
}
