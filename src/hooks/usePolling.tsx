import { useEffect } from "react";
import config from "../config";

/**
 * A hook that periodically polls the same function call if a precondition is met
 * @param fn
 * @param frequency
 * @param precondition
 */
export function usePolling(
  fn: Function,
  frequency: number = config.pollingFrequency,
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
