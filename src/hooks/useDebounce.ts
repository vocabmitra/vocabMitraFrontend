import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating the returned value until after `delay` ms
 * have elapsed since the last time the value changed.
 *
 * Used for search inputs to avoid firing an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
