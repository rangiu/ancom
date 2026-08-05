import rateLimit from 'express-rate-limit';

// Strict rate limiter for voting endpoint (max 10 requests per 15 minutes per IP)
export const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many voting requests from this IP address. Please try again later.',
  },
});

// General rate limiter for reading stats (max 200 requests per 15 minutes per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
