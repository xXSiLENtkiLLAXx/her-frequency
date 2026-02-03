/**
 * Client-side rate limiter using localStorage.
 * This provides a first line of defense against spam but should be
 * combined with server-side rate limiting for full protection.
 */

const RATE_LIMIT_PREFIX = 'rate_limit_';

interface RateLimitConfig {
  key: string;
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number;
}

export const checkRateLimit = (config: RateLimitConfig): { allowed: boolean; secondsRemaining: number } => {
  const storageKey = `${RATE_LIMIT_PREFIX}${config.key}`;
  const now = Date.now();
  
  try {
    const stored = localStorage.getItem(storageKey);
    const attempts: number[] = stored ? JSON.parse(stored) : [];
    
    // Filter to only keep attempts within the time window
    const recentAttempts = attempts.filter(time => now - time < config.windowMs);
    
    if (recentAttempts.length >= config.maxAttempts) {
      // Find when the oldest attempt will expire
      const oldestAttempt = Math.min(...recentAttempts);
      const expiresAt = oldestAttempt + config.windowMs;
      const secondsRemaining = Math.ceil((expiresAt - now) / 1000);
      
      return { allowed: false, secondsRemaining };
    }
    
    return { allowed: true, secondsRemaining: 0 };
  } catch {
    // If localStorage fails, allow the action
    return { allowed: true, secondsRemaining: 0 };
  }
};

export const recordAttempt = (key: string, windowMs: number): void => {
  const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
  const now = Date.now();
  
  try {
    const stored = localStorage.getItem(storageKey);
    const attempts: number[] = stored ? JSON.parse(stored) : [];
    
    // Filter to only keep attempts within the time window and add new one
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    recentAttempts.push(now);
    
    localStorage.setItem(storageKey, JSON.stringify(recentAttempts));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  testimonial: {
    key: 'testimonial_submission',
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,
  },
  contactForm: {
    key: 'contact_form',
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 5,
  },
  eventRegistration: {
    key: 'event_registration',
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 10,
  },
};
