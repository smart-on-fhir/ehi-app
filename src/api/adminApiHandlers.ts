import { request } from "../lib";
import { validFileFilter } from "../lib/attachmentUploadHelpers";

const baseUrl = process.env.REACT_APP_EHI_SERVER;

///////////
// JOB API

export function getExportJobLink(id: string) {
  return `${baseUrl}/admin/jobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.ExportJob[]> {
  return request<EHIApp.ExportJob[]>(`${baseUrl}/admin/jobs`, {
    signal,
    credentials: "include",
  });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    signal,
    credentials: "include",
  });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject",
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/${newStatus}`, {
    method: "post",
    signal,
    credentials: "include",
  });
}

export async function abortExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/abort`, {
    method: "post",
    credentials: "include",
    signal,
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    method: "delete",
    credentials: "include",
    signal,
  });
}

//////////////////
// ATTACHMENT API
export const MAX_FILE_NUM = 5;

/**
 * Upload attachments for a given job
 * @param job
 * @param attachments
 * @returns Promise corresponding to the upload request,  resulting in a new attachments
 */
export async function uploadAttachments(
  jobId: EHIApp.ExportJob["id"],
  attachments: FileList
): Promise<EHIApp.ExportJob> {
  // attachments is a FileList, must convert into an iterable for filtering
  let filesArray = Array.from(attachments);
  // If we have a non-fatal error to report, collect it in this variable
  let minorError: Error;
  if (filesArray.length > MAX_FILE_NUM) {
    console.warn(
      `Number of files provided exceeds MAX_FILE_NUM of ${MAX_FILE_NUM}, only using the first ${MAX_FILE_NUM}.`
    );
    minorError = new Error(
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
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${jobId}/add-files`, {
    method: "post",
    body: formData,
    credentials: "include",
  }).finally(() => {
    if (minorError !== undefined) {
      throw minorError;
    }
  });
}

/**
 * Delete an attachment for a given job
 * @param jobId
 * @param attachmentName
 * @returns nothing, but should remove the attachment from the job
 */
export async function deleteAttachment(
  jobId: EHIApp.ExportJob["id"],
  attachmentName: string
): Promise<EHIApp.ExportJob> {
  return await request(`${baseUrl}/admin/jobs/${jobId}/remove-files`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      action: "removeAttachments",
      params: [attachmentName],
    }),
  });
}
