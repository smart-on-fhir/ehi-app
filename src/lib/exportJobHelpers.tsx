import { ExportJobSummary, ExportJob } from "../types";

export const EXPORT_SERVER = `${process!.env!.REACT_APP_EHI_SERVER}/jobs`;

export function getExportJobLink(id: string) {
  return `${EXPORT_SERVER}/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const exportJobUrl = `${EXPORT_SERVER}`;
  const response = await fetch(exportJobUrl, {
    signal,
  });
  return response.json();
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
) {
  const exportJobStatusUpdate = `${EXPORT_SERVER}/${id}`;
  const response = await fetch(exportJobStatusUpdate, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
  if (response.status === 400) {
    throw new Error(await response.text());
  } else if (response.status === 200) {
    return response.json();
  } else {
    throw new Error(`Unexpected status of ${response.status}`);
  }
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  const exportJobUrl = `${EXPORT_SERVER}/${id}`;
  const response = await fetch(exportJobUrl, {
    signal,
  });
  if (response.status === 404) {
    const operationOutcome = await response.json();
    throw new Error(
      `Returned operation outcome of "${operationOutcome.issue[0].severity} : ${operationOutcome.issue[0].diagnostics}"`
    );
  } else if (response.status === 200) {
    return response.json();
  } else {
    throw new Error(`Unexpected status of ${response.status}`);
  }
}
