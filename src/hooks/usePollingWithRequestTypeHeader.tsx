import { usePolling } from "./usePolling";

/**
 * A hook that polls a function hitting an ExportJob endpoint,
 * providing the EHI-app backend's custom `x-request-type` header set to "polling"
 * @param jobFn
 * @param frequency
 * @param precondition
 */
export function usePollingWithRequestTypeHeader(
  jobFn: (requestOptions?: RequestInit) => Promise<any>,
  frequency?: number,
  precondition?: () => boolean
) {
  // Wrap our job function so that we include the `x-request-type` header with value "polling"
  const jobFunctionWithPollingHeader = (requestOptions?: RequestInit) => {
    let headers = requestOptions ? requestOptions?.headers : {};
    headers = { ...headers, "x-request-type": "polling" };
    return jobFn({ ...requestOptions, headers });
  };
  usePolling(jobFunctionWithPollingHeader, frequency, precondition);
}
