import { useState } from "react";

// Given a particular key, use session storage to track data with that key, or use preexisting data
// Based on https://usehooks.com/useSessionStorage/
export default function useSessionStorage(key: any, defaultValue: any) {
  // Initial value should pull from session storage if there's data
  function getSessionStorage() {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const unparsedValue = window.sessionStorage.getItem(key);
      // If there is no unparsedValue, use the defaultValue
      return unparsedValue ? JSON.parse(unparsedValue) : defaultValue;
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
  }
  const [valueInMemory, setValueInMemory] = useState(getSessionStorage);

  // Before setting the value in memory, update SessionStorage
  function setStateWithSessionStorageUpdates(newValue: any) {
    try {
      // SetState can accept a function or a new value; this normalizes across those cases
      const value =
        newValue instanceof Function ? newValue(valueInMemory) : newValue;
      // Save state
      setValueInMemory(value);
      // Save to session storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error(e);
      // Should we do something if we encounter
    }
  }

  return [valueInMemory, setStateWithSessionStorageUpdates];
}
