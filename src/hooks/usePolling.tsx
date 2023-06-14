import { useEffect } from "react";

export function usePolling(
  fn: Function,
  precondition: () => boolean = () => true,
  frequency: number = 5000
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
