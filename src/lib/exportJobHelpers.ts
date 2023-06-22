import { useCallback } from "react";
import { request } from ".";
import pkg from "../../package.json";

export function getExportJobLink(id: string) {
  if (process.env.NODE_ENV === "production") {
    return `/api/jobs/${id}/download`;
  }
  return `${pkg.proxy}/api/jobs/${id}/download`;
}

export async function getExportJobs(
  signal?: AbortSignal
): Promise<EHIApp.ExportJob[]> {
  return request<EHIApp.ExportJob[]>("/api/jobs", {
    signal,
  });
}

export async function getExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}`, { signal });
}

export async function updateExportStatus(
  id: string,
  newStatus: "approve" | "reject"
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}/${newStatus}`, {
    method: "post",
  });
}

export async function deleteExportJob(
  id: string,
  signal?: AbortSignal
): Promise<EHIApp.ExportJob> {
  return request<EHIApp.ExportJob>(`/api/jobs/${id}`, {
    method: "delete",
    signal,
  });
}

// Determines if a job can change given its status, useful for determining if we should check for changes to this job
export function canJobChangeStatus(job: EHIApp.ExportJob): boolean {
  return (
    job.status === "awaiting-input" ||
    job.status === "in-review" ||
    job.status === "requested"
  );
}

// Returns a useCallback-ified condition function for checking if, given these jobs, we should poll for changes to the `api/jobs` endpoint
export function useJobsPollingConditionCallback(
  jobs: EHIApp.ExportJob[] | null
) {
  return useCallback(() => {
    if (jobs === null) return false;
    return jobs.some(canJobChangeStatus);
  }, [jobs]);
}

// Returns a useCallback-ified condition function for checking if, given this job, we should poll for changes to the `api/jobs` endpoint
export function useJobPollingConditionCallback(job: EHIApp.ExportJob | null) {
  return useCallback(() => {
    if (job === null) return false;
    return canJobChangeStatus(job);
  }, [job]);
}
