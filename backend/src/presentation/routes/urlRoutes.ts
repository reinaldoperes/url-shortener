import express, { Request, Response, NextFunction } from "express";
import { UrlController } from "../controllers/UrlController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimitMiddleware.js";

const urlRoutes = express.Router();
const urlController = UrlController;

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

urlRoutes.post(
  "/shorten",
  authMiddleware,
  rateLimiter,
  asyncHandler(urlController.shorten.bind(urlController)),
);

urlRoutes.get(
  "/:slug",
  asyncHandler(urlController.redirect.bind(urlController)),
);

urlRoutes.get(
  "/stats/:slug",
  asyncHandler(urlController.getStats.bind(urlController)),
);

urlRoutes.put(
  "/update-slug/:urlId",
  authMiddleware,
  asyncHandler(urlController.updateSlug.bind(urlController)),
);

urlRoutes.delete(
  "/:urlId",
  authMiddleware,
  asyncHandler(urlController.deleteUrl.bind(urlController)),
);

export { urlRoutes };
