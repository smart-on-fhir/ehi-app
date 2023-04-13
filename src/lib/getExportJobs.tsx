import { ExportJobSummary } from "../types";
import { EHI_SERVER_BASE_URL } from "./constants";

export default async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJobSummary[]> {
  const baseUrl = EHI_SERVER_BASE_URL;
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
