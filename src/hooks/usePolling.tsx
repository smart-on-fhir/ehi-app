import { useEffect } from "react";

export function usePolling(fn: Function, frequency: number = 5000) {
  useEffect(() => {
    const interval = setInterval(fn, frequency);
    return () => {
      clearInterval(interval);
    };
  }, [frequency, fn]);
}
