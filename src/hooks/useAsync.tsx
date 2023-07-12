// The hook we got working
import { useReducer, useCallback, useEffect } from "react";
interface State<T> {
  loading: boolean;
  error: Error | null;
  result: T | null;
}

interface UseAsyncHook<T> {
  execute: (signal?: AbortSignal) => Promise<void>;
  loading: boolean;
  result: T | null;
  error: Error | null;
  dispatch: React.Dispatch<Partial<State<T>>>;
}

function reducer<T>(state: State<T>, payload: Partial<State<T>>): State<T> {
  return { ...state, ...payload };
}

export function useAsync<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  immediate = false
): UseAsyncHook<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: immediate,
    error: null,
    result: null,
  });

  const execute = useCallback(
    (signal?: AbortSignal) => {
      dispatch({ loading: true, error: null });
      return fn(signal).then(
        (result: T) => {
          if (!signal?.aborted) {
            dispatch({ loading: false, result });
          }
        },
        (error: Error) => {
          if (!signal?.aborted) {
            dispatch({ loading: false, error });
          }
        }
      );
    },
    [fn]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (immediate) {
      execute(abortController.signal);
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
