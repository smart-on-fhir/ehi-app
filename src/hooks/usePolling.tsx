import { useEffect } from "react";

export function usePolling(
  fn: Function,
  frequency: number = 5000,
  precondition: () => boolean = () => true
) {
  useEffect(() => {
    let interval: number;
    if (precondition()) {
      interval = setInterval(fn, frequency);
    }
    return () => {
      clearInterval(interval);
    };
  }, [fn, frequency, precondition]);
}
