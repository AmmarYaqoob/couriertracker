import { Router } from "express";
import { orderController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const orderRouter = Router();

orderRouter.get("/", asyncHandler(orderController.list));
orderRouter.get("/:id", asyncHandler(orderController.getById));
