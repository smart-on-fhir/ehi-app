import { useCallback } from "react";
import { useAsync } from "./useAsync";
import { UnauthorizedError } from "../lib/errors";
import { useNavigate } from "react-router";
import useAuthConsumer from "../context/authContext";

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
  const navigate = useNavigate();
  const { isAdminRoute, logout } = useAuthConsumer();
  const {
    execute: refreshJobs,
    loading,
    result: jobs,
    error,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } = useAsync<T>(useCallback(getJobsFn, []), true);

  if (error instanceof UnauthorizedError) {
    logout().then(() => {
      isAdminRoute ? navigate("/admin/login") : navigate("/login");
    });
  }

  return {
    refreshJobs,
    loading,
    jobs,
    error,
  };
}
