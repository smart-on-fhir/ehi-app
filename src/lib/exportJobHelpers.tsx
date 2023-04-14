import { ExportJobSummary, ExportJob } from "../types";

export async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const exportJobUrl = `${process!.env!.REACT_APP_EHI_SERVER}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<ExportJob> {
  console.log("calling single job export ");
  const exportJobUrl = `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${id}`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
