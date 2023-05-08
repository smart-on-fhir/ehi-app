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
  const exportJobUrl = `${EXPORT_ROUTE}`;
  return request<ExportJobSummary[]>(exportJobUrl, { signal });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  const exportJobUrl = `${EXPORT_ROUTE}/${id}`;
  return request<ExportJob>(exportJobUrl, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
): Promise<ExportJob> {
  const exportJobStatusUpdate = `${EXPORT_ROUTE}/${id}`;
  return request<ExportJob>(exportJobStatusUpdate, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
}
