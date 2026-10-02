import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { ReportService } from "../services/report.service";

export class ReportController {
  constructor(private readonly reports: ReportService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Reports loaded", await this.reports.list());
  };
}
