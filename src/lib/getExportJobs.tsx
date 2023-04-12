import { ExportJob } from "../types";

export default async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJob[]> {
  const baseUrl = "https://ehi-server.herokuapp.com";
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
