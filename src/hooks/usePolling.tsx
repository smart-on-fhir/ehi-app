import { useEffect } from "react";
import config from "../config";

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
