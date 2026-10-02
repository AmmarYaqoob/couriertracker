import { isValidObjectId, type FilterQuery, type Model } from "mongoose";
import type { CreateUserData, UpdateUserData, UserListFilter, UserRecord } from "../domain/user";
import type { Role } from "../domain/roles";
import type { UserDocument, UserSchema } from "../models/user.model";
import type { UserRepository } from "./user.repository";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toRecord(doc: UserDocument): UserRecord {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role as Role,
    title: doc.title,
    active: doc.active,
    lastActiveAt: doc.lastActiveAt ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoUserRepository implements UserRepository {
  constructor(private readonly model: Model<UserSchema>) {}

  async create(data: CreateUserData): Promise<UserRecord> {
    const doc = await this.model.create(data);
    return toRecord(doc);
  }

  async findById(id: string): Promise<UserRecord | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.model.findById(id);
    return doc ? toRecord(doc) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase() });
    return doc ? toRecord(doc) : null;
  }

  async list(filter: UserListFilter): Promise<UserRecord[]> {
    const query: FilterQuery<UserSchema> = {};
    if (filter.role) query.role = filter.role;
    if (filter.active !== undefined) query.active = filter.active;
    if (filter.search) {
      const pattern = new RegExp(escapeRegex(filter.search), "i");
      query.$or = [{ name: pattern }, { email: pattern }];
    }
    const docs = await this.model.find(query).sort({ name: 1 });
    return docs.map(toRecord);
  }

  async update(id: string, data: UpdateUserData): Promise<UserRecord | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? toRecord(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const doc = await this.model.findByIdAndDelete(id);
    return doc !== null;
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}
