import { Router } from "express";
import { equipmentController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const equipmentRouter = Router();

equipmentRouter.get("/", asyncHandler(equipmentController.list));
equipmentRouter.get("/:id", asyncHandler(equipmentController.getById));
equipmentRouter.post("/:id/defects", asyncHandler(equipmentController.addDefect));
