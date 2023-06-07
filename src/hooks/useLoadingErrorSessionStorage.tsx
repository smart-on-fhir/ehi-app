import useSessionStorage from "./useSessionStorage";
import { useCallback, useEffect, useState } from "react";

interface useLoadingErrorReturnValue<ArgType extends any[], ReturnType> {
  execute: (...args: ArgType) => Promise<void>;
  loading: boolean;
  error: Error | null;
  result: ReturnType | null;
}

export default function useLoadingErrorSessionStorage<
  ArgType extends any[],
  ReturnType
>(
  fn: (...args: ArgType) => Promise<ReturnType>,
  sessionStorageId: string,
  immediate?: boolean,
  ...immediateArgs: ArgType | []
): useLoadingErrorReturnValue<ArgType, ReturnType> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useSessionStorage<ReturnType | null>(
    sessionStorageId,
    null
  );

  const execute = useCallback(
    (...args: ArgType) => {
      setLoading(true);
      setError(null);
      return fn(...args).then(
        (result: ReturnType) => {
          setLoading(false);
          setResult(result);
        },
        (error: Error) => {
          setLoading(false);
          setError(error);
        }
      );
    },
    [fn, setResult]
  );

  useEffect(() => {
    if (immediate && immediateArgs.length !== 0) {
      execute(...(immediateArgs as ArgType));
    }
    return () => {
      setLoading(false);
      setError(null);
    };
  }, [execute, immediate, immediateArgs]);

  return {
    execute,
    loading,
    result,
    error,
  };
}
