import type { PublicUser } from "../domain/user";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        token: string;
        user: PublicUser;
      };
    }
  }
}

export {};
