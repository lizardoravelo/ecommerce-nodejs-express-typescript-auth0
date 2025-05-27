import rateLimit from "express-rate-limit";
import { Request } from "express";

interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Generates a custom rate limiter
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests. Please try again later.",
  keyGenerator,
}: RateLimiterOptions) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
};

// Predefined global limiter (optional default)
export const globalRateLimiter = createRateLimiter({
  max: 100,
});

// Sign-in rate limiter
export const signInLimiter = createRateLimiter({
  max: 3,
  message: "Too many login attempts. Try again in 15 minutes.",
});

// Sign-up rate limiter
export const signUpLimiter = createRateLimiter({
  max: 5,
  message: "Too many sign-up attempts. Try again later.",
});

// GraphQL API rate limiter
export const graphqlUserLimiter = createRateLimiter({
  max: 60,
  windowMs: 10 * 60 * 1000,
  keyGenerator: (req) => {
    const userId = (req as any).user?.sub || req.ip;
    return userId;
  },
  message: "Too many GraphQL requests. Please wait before trying again.",
});
