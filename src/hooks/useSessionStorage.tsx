import { useState } from "react";

export default function useSessionStorage<T>(
  id: string,
  initialValue: T
): [T, (newValue: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const sessionState = window.sessionStorage.getItem(id);
      return sessionState ? JSON.parse(sessionState) : initialValue;
    } catch (err) {
      console.error("Error occurred during session storage hook: ", err);
      return initialValue;
    }
  });

  function setSessionState(newValue: T | ((val: T) => T)): void {
    try {
      const val = newValue instanceof Function ? newValue(state) : newValue;
      setState(val);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(id, JSON.stringify(newValue));
      }
    } catch (err) {
      console.error("Error occurred during session storage hook: ", err);
    }
  }

  // Try to get data from sessionStorage
  return [state, setSessionState];
}
