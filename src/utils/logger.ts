/**
 * Safe application logger.
 * In production builds or non-development environments, logs are suppressed
 * to prevent leaking internal application state, payloads, or error details to the browser console.
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },
};
