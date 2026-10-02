import bcrypt from "bcryptjs";
import { HOME_BY_ROLE, ROLE_TITLES, ROLES, isRole, type Role } from "../domain/roles";
import type { PublicUser, RoleInfo, UpdateUserData, UserListFilter, UserRecord } from "../domain/user";
import { AppError, isDuplicateKey } from "../errors/appError";
import type { UserRepository } from "../repositories/user.repository";

const PASSWORD_ROUNDS = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserListQuery {
  role?: string;
  search?: string;
  active?: string;
}

export class UserService {
  constructor(private readonly users: UserRepository) {}

  listRoles(): RoleInfo[] {
    return ROLES.map((role) => ({
      role,
      title: ROLE_TITLES[role],
      home: HOME_BY_ROLE[role],
    }));
  }

  async create(input: unknown): Promise<PublicUser> {
    const body = asRecord(input);
    const name = readName(body.name);
    const email = readEmail(body.email);
    const password = readPassword(body.password);
    const role = readRole(body.role);
    const active = body.active === undefined ? true : readActive(body.active);

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new AppError(409, "A user with this email already exists");
    }

    try {
      const created = await this.users.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, PASSWORD_ROUNDS),
        role,
        title: ROLE_TITLES[role],
        active,
      });
      return toPublic(created);
    } catch (err) {
      if (isDuplicateKey(err)) {
        throw new AppError(409, "A user with this email already exists");
      }
      throw err;
    }
  }

  async list(query: UserListQuery): Promise<PublicUser[]> {
    const filter: UserListFilter = {};
    if (query.role !== undefined) filter.role = readRole(query.role);
    if (query.search !== undefined) {
      if (query.search.length > 80) {
        throw new AppError(400, "Search must be 80 characters or fewer");
      }
      filter.search = query.search;
    }
    if (query.active !== undefined) filter.active = readActiveQuery(query.active);

    const records = await this.users.list(filter);
    return records.map(toPublic);
  }

  async getById(id: string): Promise<PublicUser> {
    const record = await this.users.findById(id);
    if (!record) throw new AppError(404, "User not found");
    return toPublic(record);
  }

  async authenticate(input: unknown): Promise<PublicUser> {
    const body = asRecord(input);
    const email = readEmail(body.email);
    if (typeof body.password !== "string" || body.password.length === 0) {
      throw new AppError(400, "Password is required");
    }

    const record = await this.users.findByEmail(email);
    const passwordMatches = record ? await bcrypt.compare(body.password, record.passwordHash) : false;
    if (!record || !passwordMatches) {
      throw new AppError(401, "Email or password is not correct");
    }
    if (!record.active) throw new AppError(403, "This account is disabled");

    const touched = await this.users.update(record.id, { lastActiveAt: new Date() });
    return toPublic(touched ?? record);
  }

  async update(id: string, input: unknown): Promise<PublicUser> {
    const body = asRecord(input);
    const changes: UpdateUserData = {};

    if (body.name !== undefined) changes.name = readName(body.name);
    if (body.email !== undefined) changes.email = readEmail(body.email);
    if (body.password !== undefined) {
      changes.passwordHash = await bcrypt.hash(readPassword(body.password), PASSWORD_ROUNDS);
    }
    if (body.role !== undefined) {
      const role = readRole(body.role);
      changes.role = role;
      changes.title = ROLE_TITLES[role];
    }
    if (body.active !== undefined) changes.active = readActive(body.active);

    if (Object.keys(changes).length === 0) {
      throw new AppError(400, "No changes were provided");
    }

    if (changes.email) {
      const existing = await this.users.findByEmail(changes.email);
      if (existing && existing.id !== id) {
        throw new AppError(409, "A user with this email already exists");
      }
    }

    try {
      const updated = await this.users.update(id, changes);
      if (!updated) throw new AppError(404, "User not found");
      return toPublic(updated);
    } catch (err) {
      if (isDuplicateKey(err)) {
        throw new AppError(409, "A user with this email already exists");
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.users.delete(id);
    if (!deleted) throw new AppError(404, "User not found");
  }
}

function toPublic(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    home: HOME_BY_ROLE[user.role],
    active: user.active,
    lastActiveAt: user.lastActiveAt ? user.lastActiveAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function asRecord(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AppError(400, "Request body must be an object");
  }
  return input as Record<string, unknown>;
}

function readName(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, "Name is required");
  }
  const name = value.trim();
  if (name.length > 80) throw new AppError(400, "Name must be 80 characters or fewer");
  return name;
}

function readEmail(value: unknown): string {
  if (typeof value !== "string") throw new AppError(400, "Email is required");
  const email = value.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new AppError(400, "Email is not valid");
  return email;
}

function readPassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 8) {
    throw new AppError(400, "Password must be at least 8 characters");
  }
  if (value.length > 128) throw new AppError(400, "Password must be 128 characters or fewer");
  return value;
}

function readRole(value: unknown): Role {
  if (typeof value !== "string" || !isRole(value)) {
    throw new AppError(400, `Role must be one of: ${ROLES.join(", ")}`);
  }
  return value;
}

function readActive(value: unknown): boolean {
  if (typeof value !== "boolean") throw new AppError(400, "Active must be true or false");
  return value;
}

function readActiveQuery(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new AppError(400, "Active must be true or false");
}
