import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { PayrollService } from "../services/payroll.service";

export class PayrollController {
  constructor(private readonly payroll: PayrollService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Payroll loaded", await this.payroll.list());
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Payroll rider loaded", await this.payroll.getById(req.params.id));
  };
}
