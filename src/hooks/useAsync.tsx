// The hook we got working
import { useReducer, useCallback, useEffect } from "react";
interface State<ReturnType> {
  loading: boolean;
  error: Error | null;
  result: ReturnType | null;
}

interface UseAsyncReturnValue<ArgType extends any[], ReturnType> {
  execute: (signal?: AbortSignal, ...args: ArgType) => Promise<void>;
  loading: boolean;
  error: Error | null;
  result: ReturnType | null;
}

function reducer<ReturnType>(
  state: State<ReturnType>,
  payload: Partial<State<ReturnType>>
): State<ReturnType> {
  return { ...state, ...payload };
}

export default function useAsync<ArgType extends any[], ReturnType>(
  fn: (signal?: AbortSignal, ...args: ArgType) => Promise<ReturnType>,
  immediate?: boolean,
  ...immediateArgs: ArgType
): UseAsyncReturnValue<ArgType, ReturnType> {
  const [state, dispatch] = useReducer(reducer<ReturnType>, {
    loading: immediate === undefined ? false : immediate,
    error: null,
    result: null,
  });

  const execute = useCallback(
    (signal?: AbortSignal, ...args: ArgType) => {
      dispatch({ loading: true, result: null, error: null });
      return fn(signal, ...args).then(
        (result: ReturnType) => {
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
      execute(abortController.signal, ...immediateArgs);
    }
    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, immediate]);

  return {
    execute,
    loading: state.loading,
    result: state.result,
    error: state.error,
  };
}
