// The hook we got working
import { useReducer, useCallback, useEffect } from "react";
interface State<ReturnType> {
  loading: boolean;
  error: Error | null;
  result: ReturnType | null;
}

interface useLoadingErrorReturnValue<ArgType extends any[], ReturnType> {
  execute: (...args: ArgType) => Promise<void>;
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

export default function useLoadingError<ArgType extends any[], ReturnType>(
  fn: (...args: ArgType) => Promise<ReturnType>,
  immediate?: boolean,
  ...immediateArgs: ArgType
): useLoadingErrorReturnValue<ArgType, ReturnType> {
  const [state, dispatch] = useReducer(reducer<ReturnType>, {
    loading: immediate === undefined ? false : immediate,
    error: null,
    result: null,
  });

  const execute = useCallback(
    (...args: ArgType) => {
      dispatch({ loading: true, result: null, error: null });
      return fn(...args).then(
        (result: ReturnType) => {
          dispatch({ loading: false, result });
        },
        (error: Error) => {
          dispatch({ loading: false, error });
        }
      );
    },
    [fn]
  );

  useEffect(() => {
    if (immediate) {
      execute(...immediateArgs);
    }
    return () => {
      dispatch({ loading: false, error: null, result: null });
    };
  }, [execute, immediate, immediateArgs]);

  return {
    execute,
    loading: state.loading,
    result: state.result,
    error: state.error,
  };
}
