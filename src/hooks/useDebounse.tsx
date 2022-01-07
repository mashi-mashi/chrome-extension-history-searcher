import { useState, useEffect } from 'react';

export const useDebounceValue = (value: string, delayMilliseconds = 200) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMilliseconds);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMilliseconds]);
  return debouncedValue;
};
