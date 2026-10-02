import { Router } from "express";
import { documentController } from "../container";
import { asyncHandler } from "../middleware/asyncHandler";

export const documentRouter = Router();

documentRouter.get("/", asyncHandler(documentController.list));
documentRouter.get("/:id", asyncHandler(documentController.getById));
