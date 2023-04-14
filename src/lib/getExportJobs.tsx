import { ExportJobSummary } from "../types";

export default async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const baseUrl = process!.env!.REACT_APP_EHI_SERVER;
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
