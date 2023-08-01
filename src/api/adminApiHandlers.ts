import { request } from "../lib";
import { formatFilterAttachments } from "../lib/attachmentUploadHelpers";

const baseUrl = process.env.REACT_APP_EHI_SERVER;

///////////
// JOB API

export function getExportJobLink(id: EHIApp.ExportJob["id"]) {
  return `${baseUrl}/admin/jobs/${id}/download`;
}

export async function getExportJobs(
  requestOptions?: RequestInit
): Promise<EHIApp.ExportJob[]> {
  return request<EHIApp.ExportJob[]>(`${baseUrl}/admin/jobs`, {
    ...requestOptions,
    credentials: "include",
  });
}

export async function getExportJob(
  id: EHIApp.ExportJob["id"],
  requestOptions?: RequestInit
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    ...requestOptions,
    credentials: "include",
  });
}

export async function updateExportStatus(
  id: EHIApp.ExportJob["id"],
  newStatus: "approve" | "reject",
  requestOptions?: RequestInit
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/${newStatus}`, {
    ...requestOptions,
    method: "post",
    credentials: "include",
  });
}

export async function abortExportJob(
  id: EHIApp.ExportJob["id"],
  requestOptions?: RequestInit
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}/abort`, {
    ...requestOptions,
    method: "post",
    credentials: "include",
  });
}

export async function deleteExportJob(
  id: EHIApp.ExportJob["id"],
  requestOptions?: RequestInit
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`${baseUrl}/admin/jobs/${id}`, {
    ...requestOptions,
    method: "delete",
    credentials: "include",
  });
}

//////////////////
// ATTACHMENT API

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
  // Format our fileList into an array of files, filtering and aggregating error information as appropriate
  const [filesToAdd, minorError] = formatFilterAttachments(attachments);

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
