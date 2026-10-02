import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { DelayService } from "../services/delay.service";

export class DelayController {
  constructor(private readonly delays: DelayService) {}

  catalog = (_req: Request, res: Response): void => {
    sendSuccess(res, 200, "Delay catalog loaded", this.delays.catalog());
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Delays loaded", await this.delays.list());
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Late delivery loaded", await this.delays.getById(req.params.orderId));
  };

  escalate = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Restaurant escalated", await this.delays.escalate(req.params.restaurantId));
  };
}
