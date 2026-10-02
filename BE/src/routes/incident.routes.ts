import { Router } from "express";
import { incidentController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const incidentRouter = Router();

incidentRouter.get("/catalog", asyncHandler(incidentController.catalog));
incidentRouter.get("/", asyncHandler(incidentController.list));
incidentRouter.get("/:id", asyncHandler(incidentController.getById));
incidentRouter.post("/", asyncHandler(incidentController.create));
incidentRouter.patch("/:id", asyncHandler(incidentController.update));
