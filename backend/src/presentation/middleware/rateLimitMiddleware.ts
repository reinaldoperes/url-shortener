import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
