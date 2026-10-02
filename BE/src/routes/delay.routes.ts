import { Router } from "express";
import { delayController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const delayRouter = Router();

delayRouter.get("/catalog", asyncHandler(delayController.catalog));
delayRouter.get("/", asyncHandler(delayController.list));
delayRouter.post("/restaurants/:restaurantId/escalate", asyncHandler(delayController.escalate));
delayRouter.get("/:orderId", asyncHandler(delayController.getById));
