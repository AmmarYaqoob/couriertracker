import type { Request, Response } from "express";
import { sendSuccess } from "../http/apiResponse";
import type { OrderService } from "../services/order.service";

function queryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class OrderController {
  constructor(private readonly orders: OrderService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const data = await this.orders.list({
      status: queryValue(req.query.status),
      platform: queryValue(req.query.platform),
    });
    sendSuccess(res, 200, "Orders loaded", data);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, 200, "Order loaded", await this.orders.getById(req.params.id));
  };
}
