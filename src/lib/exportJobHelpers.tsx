import { ExportJobSummary, ExportJob } from "../types";

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const exportJobUrl = `${process!.env!.REACT_APP_EHI_SERVER}/jobs`;
  const response = await fetch(exportJobUrl, {
    signal,
  });
  return response.json();
}

export async function updateExportStatus(
  job: ExportJob,
  newStatus: "approve" | "reject"
) {
  const exportJobStatusUpdate = `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${
    job.id
  }`;
  const response = await fetch(exportJobStatusUpdate, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: newStatus }),
  });
  console.log(response);
  if (response.status === 400) {
    console.log(response);
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
  const exportJobUrl = `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${id}`;
  const response = await fetch(exportJobUrl, {
    signal,
    // signal: signal ? signal : null,
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
