/**
 * Environment-aware logger that prevents sensitive error details
 * from being exposed in production browser consoles.
 */
const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    // In production, errors could be sent to an external monitoring service
    // like Sentry, LogRocket, etc. For now, we just suppress console output.
  },
  
  warn: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(message, data);
    }
  },
  
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.info(message, data);
    }
  },
  
  debug: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.debug(message, data);
    }
  },
};

export default logger;
