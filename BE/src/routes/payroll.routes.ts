import { Router } from "express";
import { payrollController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const payrollRouter = Router();

payrollRouter.get("/", asyncHandler(payrollController.list));
payrollRouter.get("/:id", asyncHandler(payrollController.getById));
