import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.js";

const authRoutes = express.Router();
const authController = new AuthController();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

authRoutes.post(
  "/register",
  asyncHandler(authController.register.bind(authController)),
);
authRoutes.post(
  "/login",
  asyncHandler(authController.login.bind(authController)),
);

export { authRoutes };
