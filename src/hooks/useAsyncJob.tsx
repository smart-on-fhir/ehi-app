import { useCallback, useEffect } from "react";
import { useAsync } from "./useAsync";
import { UnauthorizedError } from "../lib/errors";
import { useNavigate } from "react-router";
import useAuthConsumer from "../context/authContext";

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
  // For navigating to login as needed, we need some state
  const navigate = useNavigate();
  const { isAdminRoute, logout } = useAuthConsumer();

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

  useEffect(() => {
    // If we have an UnauthorizedError, we should redirect to the login page
    if (error instanceof UnauthorizedError) {
      logout().then(() => {
        isAdminRoute ? navigate("/admin/login") : navigate("/login");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    refreshJob,
    updateJob,
    loading,
    job,
    error,
  };
}
