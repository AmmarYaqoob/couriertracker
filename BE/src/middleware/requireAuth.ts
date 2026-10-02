import type { RequestHandler } from "express";
import { AppError } from "../errors/appError";
import type { SessionRepository } from "../repositories/session.repository";
import type { UserService } from "../services/user.service";

export function createRequireAuth(sessions: SessionRepository, accounts: UserService): RequestHandler {
  return async (req, _res, next) => {
    try {
      const header = req.header("authorization") ?? "";
      const match = /^Bearer\s+(\S+)$/i.exec(header);
      if (!match) throw new AppError(401, "Sign in is required");

      const userId = await sessions.findUserId(match[1]);
      if (!userId) throw new AppError(401, "Session is not valid");

      const record = await accounts.getById(userId).catch(() => null);
      if (!record) throw new AppError(401, "Session is not valid");
      if (!record.active) throw new AppError(403, "This account is disabled");

      req.auth = { token: match[1], user: record };
      next();
    } catch (err) {
      next(err);
    }
  };
}
