import { Router } from "express";
import { authController, requireAuth } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const authRouter = Router();

authRouter.post("/sign", asyncHandler(authController.sign));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/logout", requireAuth, asyncHandler(authController.logout));
