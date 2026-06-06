import rateLimit from "express-rate-limit";

export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    error: "Too many requests. Please try again after a minute.",
  },
});