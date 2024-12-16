import { useState, useEffect } from "react";

const useSessionStorage = (name) => {
  const isBrowser = typeof window !== "undefined"; // Check if running in a browser
  const [value, setValue] = useState(() => {
    if (isBrowser) {
      return sessionStorage.getItem(name) || '';
    }
    return ''; // Return empty string if not in browser
  });

  // Function to update sessionStorage and the state
  const updateValue = (newValue) => {
    setValue(newValue);
    if (isBrowser) {
      sessionStorage.setItem(name, newValue);
    }
  };

  // Function to clear the sessionStorage item and reset the state
  const clearValue = () => {
    setValue('');
    if (isBrowser) {
      sessionStorage.removeItem(name);
    }
  };

  useEffect(() => {
    if (isBrowser) {
      const storedValue = sessionStorage.getItem(name);
      if (storedValue) {
        setValue(storedValue);
      }
    }
  }, [name, isBrowser]);

  return [value, updateValue, clearValue];
};

export default useSessionStorage;