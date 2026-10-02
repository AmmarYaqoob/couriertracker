import type { Response } from "express";

export interface ApiResponse<T> {
  httpStatus: number;
  isSuccess: boolean;
  message: string;
  data: T | null;
}

export function sendSuccess<T>(res: Response, httpStatus: number, message: string, data: T): void {
  const body: ApiResponse<T> = { httpStatus, isSuccess: true, message, data };
  res.status(httpStatus).json(body);
}

export function sendFailure(res: Response, httpStatus: number, message: string, data: unknown = null): void {
  const body: ApiResponse<unknown> = { httpStatus, isSuccess: false, message, data: data ?? null };
  res.status(httpStatus).json(body);
}
