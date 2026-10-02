import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { RiderService } from "../services/rider.service";

function queryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class RiderController {
  constructor(private readonly riders: RiderService) {}

  catalog = (_req: Request, res: Response): void => {
    sendSuccess(res, 200, "Rider catalog loaded", this.riders.catalog());
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const data = await this.riders.list({
      employment: queryValue(req.query.employment),
      search: queryValue(req.query.search),
    });
    sendSuccess(res, 200, "Riders loaded", data);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Rider loaded", await this.riders.getById(req.params.id));
  };

  documents = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Documents loaded", await this.riders.documents(req.params.id));
  };

  payroll = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Payroll loaded", await this.riders.payroll(req.params.id));
  };

  compliance = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Compliance loaded", await this.riders.compliance(req.params.id));
  };

  performance = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Performance loaded", await this.riders.performance(req.params.id));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 201, "Rider created", await this.riders.create(req.body));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Rider updated", await this.riders.update(req.params.id, req.body));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.riders.remove(req.params.id);
    sendSuccess(res, 200, "Rider removed", null);
  };
}
