import { Router } from "express";
import { referenceController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const platformRouter = Router();
export const zoneRouter = Router();
export const restaurantRouter = Router();
export const employmentTypeRouter = Router();

platformRouter.get("/", asyncHandler(referenceController.platforms));
zoneRouter.get("/", asyncHandler(referenceController.zones));
restaurantRouter.get("/", asyncHandler(referenceController.restaurants));
employmentTypeRouter.get("/", asyncHandler(referenceController.employmentTypes));
