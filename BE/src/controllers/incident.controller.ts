import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { IncidentService } from "../services/incident.service";

function queryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class IncidentController {
  constructor(private readonly incidents: IncidentService) {}

  catalog = (_req: Request, res: Response): void => {
    sendSuccess(res, 200, "Incident catalog loaded", this.incidents.catalog());
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const data = await this.incidents.list({
      status: queryValue(req.query.status),
    });
    sendSuccess(res, 200, "Incidents loaded", data);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Incident loaded", await this.incidents.getById(req.params.id));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 201, "Incident logged", await this.incidents.create(req.body));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Incident updated", await this.incidents.update(req.params.id, req.body));
  };
}
