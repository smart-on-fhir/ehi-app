import { useCallback } from "react";
import { useAsync } from "./useAsync";

type EitherExport = EHIApp.ExportJob | EHIApp.PatientExportJob;

interface UseAsyncJobHook<T extends EitherExport> {
  refreshJob: (requestOptions?: RequestInit) => Promise<void>;
  updateJob: (newJob: T) => void;
  loading: boolean;
  job: T | null;
  error: Error | null;
}

export function useAsyncJob<T extends EitherExport>(
  getJobFn: (requestOptions?: RequestInit) => Promise<T>
): UseAsyncJobHook<T> {
  const {
    execute: refreshJob,
    loading,
    result: job,
    error,
    dispatch,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } = useAsync<T>(useCallback(getJobFn, []), true);

  // A helper function to update one job from another network call's response
  function updateJob(newJob: T) {
    if (job === null) return;
    dispatch({ result: newJob });
  }

  return {
    refreshJob,
    updateJob,
    loading,
    job,
    error,
  };
}
