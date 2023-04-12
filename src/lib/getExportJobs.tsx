import { ExportJob } from "../types";
import { EHISERVERBASEURL } from "./constants";

export default async function getExportJobs(
  signal?: AbortSignal
): Promise<ExportJob[]> {
  const baseUrl = EHISERVERBASEURL;
  const exportJobUrl = `${baseUrl}/jobs`;
  const response = await fetch(exportJobUrl, { signal });
  console.log(response);
  return response.json();
}
