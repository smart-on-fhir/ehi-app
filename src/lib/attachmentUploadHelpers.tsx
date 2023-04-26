import { request } from "./fetchHelpers";
import { ExportJob } from "../types";

// TODO: CONFIRM SIZE HERE?
const MAX_FILE_SIZE = 1e7;

/**
 * A filter function for deteermining which files can be uploaded to the server.
 * @param file
 * @returns true if the file will be accepted by the server; false otherwise
 */
function validFileFilter(file: File) {
  return file.size <= MAX_FILE_SIZE;
}

export const supportedFiles = [".json", ".csv", "image/*"];

/**
 * A function for formatting bytes in a human readable fashion
 * @param bytes
 * @param decimals What base to use in numeric formatting
 * @returns A readable fileSize
 */
// With gratitude: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Upload attachments for a given job
 * @param job
 * @param attachments
 * @returns
 */
export async function uploadAttachments(
  jobId: ExportJob["id"],
  attachments: FileList
): Promise<void> {
  // attachments is a FileList, must convert into an iterable for filtering
  const filesArray = Array.from(attachments);
  const filesToAdd = filesArray.filter(validFileFilter);
  //TODO: Do something with files that cannot be filtered
  const formData = new FormData();
  filesToAdd.forEach((file: File) => {
    formData.append("attachments", file, file.name);
  });
  formData.append("action", "addAttachments");
  return await request(`/jobs/${jobId}`, {
    method: "post",
    body: formData,
  });
}
