import rateLimit from "express-rate-limit";

// Basic rate limiting: 100 requests per 15 minutes
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});
