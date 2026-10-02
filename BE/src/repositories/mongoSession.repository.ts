import { createHash, randomBytes } from "crypto";
import { isValidObjectId, type Model } from "mongoose";
import type { SessionSchema } from "../models/session.model";
import type { CreatedSession, SessionRepository } from "./session.repository";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export class MongoSessionRepository implements SessionRepository {
  constructor(private readonly model: Model<SessionSchema>) {}

  async create(userId: string, ttlMs: number): Promise<CreatedSession> {
    if (!isValidObjectId(userId)) {
      throw new Error("Session user id is not valid");
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + ttlMs);
    await this.model.create({
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    });
    return { token, expiresAt };
  }

  async findUserId(token: string): Promise<string | null> {
    const doc = await this.model.findOne({ tokenHash: hashToken(token) });
    if (!doc) return null;
    if (doc.expiresAt.getTime() <= Date.now()) {
      await this.model.deleteOne({ _id: doc._id });
      return null;
    }
    return String(doc.userId);
  }

  async revoke(token: string): Promise<boolean> {
    const result = await this.model.deleteOne({ tokenHash: hashToken(token) });
    return result.deletedCount === 1;
  }
}
