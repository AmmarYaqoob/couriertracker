export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export interface SessionRepository {
  create(userId: string, ttlMs: number): Promise<CreatedSession>;
  findUserId(token: string): Promise<string | null>;
  revoke(token: string): Promise<boolean>;
}
