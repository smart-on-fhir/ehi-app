import { ExportJobSummary, ExportJob } from "../types";
import { request } from "./fetchHelpers";

export const EXPORT_ROUTE = `/jobs`;

export function getExportJobLink(id: string) {
  // Needs the actual server URL since this is used in an <a> tag, not in the request library
  return `${process!.env!.REACT_APP_EHI_SERVER}${EXPORT_ROUTE}/${id}/download`;
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
  return request<ExportJob>(`${EXPORT_ROUTE}/${id}`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<fhir4.OperationOutcome> {
  return request<fhir4.OperationOutcome>(`${EXPORT_ROUTE}/${id}`, {
    method: "delete",
    signal,
  });
}
