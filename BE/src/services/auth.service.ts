import type { PublicUser } from "../domain/user";
import { AppError } from "../errors/appError";
import type { SessionRepository } from "../repositories/session.repository";
import type { UserService } from "./user.service";

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: PublicUser;
}

export class AuthService {
  constructor(
    private readonly accounts: UserService,
    private readonly sessions: SessionRepository,
    private readonly ttlMs: number,
  ) {}

  async sign(input: unknown): Promise<AuthSession> {
    const user = await this.accounts.create(input);
    return this.openSession(user);
  }

  async login(input: unknown): Promise<AuthSession> {
    const user = await this.accounts.authenticate(input);
    return this.openSession(user);
  }

  async logout(token: string): Promise<void> {
    const revoked = await this.sessions.revoke(token);
    if (!revoked) throw new AppError(401, "Session is not valid");
  }

  private async openSession(user: PublicUser): Promise<AuthSession> {
    const session = await this.sessions.create(user.id, this.ttlMs);
    return {
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
      user,
    };
  }
}
