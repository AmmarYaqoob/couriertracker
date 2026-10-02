import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { DocumentService } from "../services/document.service";

function queryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class DocumentController {
  constructor(private readonly documents: DocumentService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const data = await this.documents.list({
      kind: queryValue(req.query.kind),
      band: queryValue(req.query.band),
      search: queryValue(req.query.search),
    });
    sendSuccess(res, 200, "Documents loaded", data);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Document loaded", await this.documents.getById(req.params.id));
  };
}
