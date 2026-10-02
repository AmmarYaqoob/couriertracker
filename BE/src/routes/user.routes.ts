import { Router } from "express";
import { userController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const userRouter = Router();

userRouter.get("/roles", asyncHandler(userController.listRoles));
userRouter.get("/", asyncHandler(userController.list));
userRouter.get("/:id", asyncHandler(userController.getById));
userRouter.post("/", asyncHandler(userController.create));
userRouter.patch("/:id", asyncHandler(userController.update));
userRouter.delete("/:id", asyncHandler(userController.remove));
