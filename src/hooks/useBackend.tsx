// The original hook provided by Vlad
import { useReducer, useMemo, useCallback, useEffect } from "react";
interface State<T = any> {
  loading: boolean;
  error: Error | null;
  result: T | null;
}

function reducer(state: State, payload: Partial<State>): State {
  return { ...state, ...payload };
}

export function useBackend<T = any>(
  fn: (signal?: AbortSignal) => Promise<T>,
  immediate = false
) {
  const [state, dispatch] = useReducer(reducer, {
    loading: immediate,
    error: null,
    result: null,
  });

  const abortController = useMemo(() => new AbortController(), []);

  const execute = useCallback(() => {
    dispatch({ loading: true, result: null, error: null });
    return fn(abortController.signal).then(
      (result: T) => {
        if (!abortController.signal.aborted) {
          dispatch({ loading: false, result });
        }
      },
      (error: Error) => {
        if (!abortController.signal.aborted) {
          dispatch({ loading: false, error });
        }
      }
    );
  }, [fn, abortController.signal]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  useEffect(() => () => abortController.abort(), [abortController]);

  return {
    execute,
    loading: state.loading,
    result: state.result as T | null,
    error: state.error,
  };
}
