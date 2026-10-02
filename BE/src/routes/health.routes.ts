import { Router } from "express";
import { dbState } from "../config/db";
import { sendFailure, sendSuccess } from "../http/apiResponse";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  const db = dbState();
  const connected = db === "connected";
  const data = { status: connected ? "ok" : "degraded", db };
  if (connected) {
    sendSuccess(res, 200, "Service is healthy", data);
    return;
  }
  sendFailure(res, 503, "Database is unavailable", data);
});
