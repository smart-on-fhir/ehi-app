import { ExportJobSummary, ExportJob } from "../types";
import { request } from "./fetchHelpers";

export const EXPORT_ROUTE = `/jobs`;

export function getExportJobLink(id: string) {
  return `${EXPORT_ROUTE}/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const exportJobUrl = `${EXPORT_ROUTE}`;
  return request(exportJobUrl, { signal });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  const exportJobUrl = `${EXPORT_ROUTE}/${id}`;
  return request(exportJobUrl, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
) {
  const exportJobStatusUpdate = `${EXPORT_ROUTE}/${id}`;
  return request(exportJobStatusUpdate, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
}
