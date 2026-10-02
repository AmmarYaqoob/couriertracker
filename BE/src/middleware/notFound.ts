import type { RequestHandler } from "express";
import { sendFailure } from "../http/apiResponse";

export const notFound: RequestHandler = (_req, res) => {
  sendFailure(res, 404, "Not found");
};
