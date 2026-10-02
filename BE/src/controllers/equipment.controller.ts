import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { EquipmentService } from "../services/equipment.service";

export class EquipmentController {
  constructor(private readonly equipment: EquipmentService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Fleet loaded", await this.equipment.list());
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Vehicle loaded", await this.equipment.getById(req.params.id));
  };

  addDefect = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 201, "Defect recorded", await this.equipment.addDefect(req.params.id, req.body));
  };
}
