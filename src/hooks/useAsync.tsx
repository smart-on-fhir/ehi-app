// The hook we got working
import { useReducer, useCallback, useEffect } from "react";
interface State<T> {
  loading: boolean;
  error: Error | null;
  result: T | null;
}

interface UseAsyncHook<T> {
  execute: (requestOptions?: RequestInit) => Promise<void>;
  loading: boolean;
  result: T | null;
  error: Error | null;
  dispatch: React.Dispatch<Partial<State<T>>>;
}

function reducer<T>(state: State<T>, payload: Partial<State<T>>): State<T> {
  return { ...state, ...payload };
}

export function useAsync<T>(
  fn: (requestOptions?: RequestInit) => Promise<T>,
  immediate = false
): UseAsyncHook<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: immediate,
    error: null,
    result: null,
  });

  const execute = useCallback(
    (requestOptions?: RequestInit) => {
      dispatch({ loading: true, error: null });
      return fn(requestOptions).then(
        (result: T) => {
          // If we don't have request options, just dispatch the result
          if (requestOptions === undefined) {
            dispatch({ loading: false, result });
          } else {
            // Otherwise, only dispatch the result if we haven't had the signal aborted
            const { signal } = requestOptions;
            if (!signal?.aborted) {
              dispatch({ loading: false, result });
            }
          }
        },
        (error: Error) => {
          // If we don't have request options, just dispatch the error
          if (requestOptions === undefined) {
            dispatch({ loading: false, error });
          } else {
            // Otherwise, only dispatch the error if we haven't had the signal aborted
            const { signal } = requestOptions;
            if (!signal?.aborted) {
              dispatch({ loading: false, error });
            }
          }
        }
      );
    },
    [fn]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (immediate) {
      execute({ signal: abortController.signal });
    }
    return () => {
      dispatch({ result: null, loading: false });
      abortController.abort();
    };
  }, [execute, immediate]);

  return {
    execute,
    loading: state.loading,
    result: state.result,
    error: state.error,
    dispatch,
  };
}
