import type { Request, Response } from "express";
import { AppError } from "../errors/appError";
import { sendSuccess } from "../http/apiResponse";
import type { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  sign = async (req: Request, res: Response): Promise<void> => {
    const session = await this.auth.sign(req.body);
    sendSuccess(res, 201, "Account created", session);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const session = await this.auth.login(req.body);
    sendSuccess(res, 200, "Signed in", session);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError(401, "Sign in is required");
    await this.auth.logout(req.auth.token);
    sendSuccess(res, 200, "Signed out", null);
  };
}
