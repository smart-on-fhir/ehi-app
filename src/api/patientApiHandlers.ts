import { request } from "../lib";
import pkg from "../../package.json";

export function getExportJobLink(id: number) {
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
  id: number,
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}`, { signal });
}

export async function deleteExportJob(
  id: number,
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}`, {
    method: "delete",
    signal,
  });
}

export async function abortExportJob(
  id: number,
  signal?: AbortSignal
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}/abort`, {
    method: "post",
    signal,
  });
}
