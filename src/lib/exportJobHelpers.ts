import { ExportJobSummary, ExportJob } from "../types";
import { request } from "./fetchHelpers";
import pkg from "../../package.json";

export const EXPORT_ROUTE = `/api/jobs`;

export function getExportJobLink(id: string) {
  // Needs the actual server URL since this is used in an <a> tag, not in the request library
  // return `${process!.env!.REACT_APP_EHI_SERVER}${EXPORT_ROUTE}/${id}/download`;
  if (process.env.NODE_ENV === "production") {
    return `${EXPORT_ROUTE}/${id}/download`
  }
  return `${pkg.proxy}${EXPORT_ROUTE}/${id}/download`
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  return request<ExportJobSummary[]>(EXPORT_ROUTE, { signal });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  return request<ExportJob>(`${EXPORT_ROUTE}/${id}`, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
): Promise<ExportJob> {
  return request<ExportJob>(`${EXPORT_ROUTE}/${id}/${newStatus}`, {
    method: "post",
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  return request<ExportJob>(`${EXPORT_ROUTE}/${id}`, {
    method: "delete",
    signal,
  });
}
