import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { useUnauthorizedErrorCheck } from "./useUnauthorizedErrorCheck";

type EitherExportList = EHIApp.ExportJob[] | EHIApp.PatientExportJob[];

interface UseAsyncJobsHook<T extends EitherExportList> {
  refreshJobs: (requestOptions?: RequestInit) => Promise<void>;
  loading: boolean;
  jobs: T | null;
  error: Error | null;
}

export default function useAsyncJobs<T extends EitherExportList>(
  getJobsFn: (requestOptions?: RequestInit) => Promise<T>
): UseAsyncJobsHook<T> {
  // For navigating to login as needed, we need some state
  const {
    execute: refreshJobs,
    loading,
    result: jobs,
    error,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } = useAsync<T>(useCallback(getJobsFn, []), true);

  // Check for and handle unauthorizedErrors
  useUnauthorizedErrorCheck(error);

  return {
    refreshJobs,
    loading,
    jobs,
    error,
  };
}
