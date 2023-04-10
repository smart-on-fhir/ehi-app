import { ExportJob } from "../types";

export default async function getExportJobs(
  baseUrl: string
): Promise<ExportJob[]> {
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl);
  console.log(response);

  return response.json();
}
