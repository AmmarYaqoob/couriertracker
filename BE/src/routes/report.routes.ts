import { Router } from "express";
import { reportController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const reportRouter = Router();

reportRouter.get("/", asyncHandler(reportController.list));
