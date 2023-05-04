import { ExportJobSummary, ExportJob } from "../types";
import { request } from "./fetchHelpers";

export const EXPORT_SERVER = `${process!.env!.REACT_APP_EHI_SERVER}/jobs`;

export function getExportJobLink(id: string) {
  return `${EXPORT_SERVER}/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const exportJobUrl = `${EXPORT_SERVER}`;
  return request(exportJobUrl, { signal });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  const exportJobUrl = `${EXPORT_SERVER}/${id}`;
  return request(exportJobUrl, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
) {
  const exportJobStatusUpdate = `${EXPORT_SERVER}/${id}`;
  return request(exportJobStatusUpdate, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
}
