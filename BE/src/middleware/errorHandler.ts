import type { ErrorRequestHandler } from "express";
import { sendFailure } from "../http/apiResponse";

type HttpError = Error & { status?: number };

export const errorHandler: ErrorRequestHandler = (err: HttpError, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  const httpStatus = typeof err.status === "number" ? err.status : 500;
  if (httpStatus >= 500) {
    console.error(err);
  }
  sendFailure(res, httpStatus, httpStatus >= 500 ? "Internal server error" : err.message);
};
