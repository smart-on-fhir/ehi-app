import { request } from "./fetchHelpers";
import { ExportJob } from "../types";

export const MAX_FILE_SIZE = 1e7;
export const MAX_FILE_NUM = 5;

/**
 * A filter function for determining which files can be uploaded to the server.
 * @param file
 * @returns true if the file will be accepted by the server; false otherwise
 */
function validFileFilter(file: File) {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * A function for formatting bytes in a human readable fashion for <GB sized files
 * @param bytes
 * @returns A readable fileSize
 */
// With gratitude: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes >= 1024 && bytes < 1048576) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}

/**
 * Parses the file name from an attachment's metadata
 * @param attachment
 * @returns The attachment's file name on the server
 */
export function getAttachmentName(attachment: fhir4.Attachment) {
  const urlSplit = attachment.url?.split("/");
  if (urlSplit === undefined) {
    throw Error(
      "Attachment did not have a URL defined; cannot determine which attachment to delete without one"
    );
  }
  // The file name is at the end of the url, split on '/'
  return urlSplit[urlSplit.length - 1];
}

/**
 * Upload attachments for a given job
 * @param job
 * @param attachments
 * @returns Promise corresponding to the upload request,  resulting in a new attachments
 */
export async function uploadAttachments(
  jobId: ExportJob["id"],
  attachments: FileList
): Promise<void> {
  // attachments is a FileList, must convert into an iterable for filtering
  let filesArray = Array.from(attachments);
  if (filesArray.length > MAX_FILE_NUM) {
    console.warn(
      `Number of files provided exceeds MAX_FILE_NUM of ${MAX_FILE_NUM}, only using the first ${MAX_FILE_NUM}.`
    );
    filesArray = filesArray.slice(0, MAX_FILE_NUM);
  }
  const filesToAdd = filesArray.filter(validFileFilter);
  const formData = new FormData();
  filesToAdd.forEach((file: File) => {
    formData.append("attachments", file, file.name);
  });
  formData.append("action", "addAttachments");
  return request(`/api/jobs/${jobId}/add-file`, {
    method: "post",
    body: formData,
  });
}

/**
 * Delete an attachment for a given job
 * @param jobId
 * @param attachmentName
 * @returns nothing, but should remove the attachment from the job
 */
export async function deleteAttachment(
  jobId: ExportJob["id"],
  attachmentName: string
): Promise<void> {
  return await request(`/api/jobs/${jobId}/remove-file`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "removeAttachments",
      params: [attachmentName],
    }),
  });
}
