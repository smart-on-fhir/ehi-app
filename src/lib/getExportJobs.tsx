import { ExportJob } from "../types";

export default async function getExportJobs(
  baseUrl: string,
  signal?: AbortSignal
): Promise<ExportJob[]> {
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
