import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { ReferenceService } from "../services/reference.service";

export class ReferenceController {
  constructor(private readonly reference: ReferenceService) {}

  platforms = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Platforms loaded", await this.reference.listPlatforms());
  };

  zones = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Zones loaded", await this.reference.listZones());
  };

  restaurants = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Restaurants loaded", await this.reference.listRestaurants());
  };

  employmentTypes = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Employment types loaded", await this.reference.listEmploymentTypes());
  };
}
