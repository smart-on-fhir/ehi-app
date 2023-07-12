import { useCallback } from "react";
import { useAsync } from "./useAsync";

type EitherExportList = EHIApp.ExportJob[] | EHIApp.PatientExportJob[];

interface UseAsyncJobsHook<T extends EitherExportList> {
  refreshJobs: (signal?: AbortSignal | undefined) => Promise<void>;
  loading: boolean;
  jobs: T | null;
  error: Error | null;
}

export default function useAsyncJobs<T extends EitherExportList>(
  getJobsFn: (signal?: AbortSignal) => Promise<T>
): UseAsyncJobsHook<T> {
  const {
    execute: refreshJobs,
    loading,
    result: jobs,
    error,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } = useAsync<T>(useCallback(getJobsFn, []), true);

  return {
    refreshJobs,
    loading,
    jobs,
    error,
  };
}
