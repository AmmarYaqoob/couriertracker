import { Router } from "express";
import { riderController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const riderRouter = Router();

riderRouter.get("/catalog", asyncHandler(riderController.catalog));
riderRouter.get("/", asyncHandler(riderController.list));
riderRouter.get("/:id/documents", asyncHandler(riderController.documents));
riderRouter.get("/:id/payroll", asyncHandler(riderController.payroll));
riderRouter.get("/:id/compliance", asyncHandler(riderController.compliance));
riderRouter.get("/:id/performance", asyncHandler(riderController.performance));
riderRouter.get("/:id", asyncHandler(riderController.getById));
riderRouter.post("/", asyncHandler(riderController.create));
riderRouter.patch("/:id", asyncHandler(riderController.update));
riderRouter.delete("/:id", asyncHandler(riderController.remove));
