import { request } from "../lib";
import pkg from "../../package.json";

export function getExportJobLink(id: number) {
  if (process.env.NODE_ENV === "production") {
    return `/api/jobs/${id}/download`;
  }
  return `${pkg.proxy}/api/jobs/${id}/download`;
}

export async function getExportJobs(
  requestOptions?: RequestInit
): Promise<EHIApp.PatientExportJob[]> {
  return request<EHIApp.PatientExportJob[]>("/api/jobs", {
    ...requestOptions,
  });
}

export async function getExportJob(
  id: number,
  requestOptions?: RequestInit
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}`, {
    ...requestOptions,
  });
}

export async function deleteExportJob(
  id: number,
  requestOptions?: RequestInit
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}`, {
    ...requestOptions,
    method: "delete",
  });
}

export async function abortExportJob(
  id: number,
  requestOptions?: RequestInit
): Promise<EHIApp.PatientExportJob> {
  return request<EHIApp.PatientExportJob>(`/api/jobs/${id}/abort`, {
    ...requestOptions,
    method: "post",
  });
}
