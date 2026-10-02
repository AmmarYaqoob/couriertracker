import type { Role } from "./roles";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  title: string;
  active: boolean;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  title: string;
  active?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  title?: string;
  active?: boolean;
  lastActiveAt?: Date | null;
}

export interface UserListFilter {
  role?: Role;
  search?: string;
  active?: boolean;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  home: string;
  active: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleInfo {
  role: Role;
  title: string;
  home: string;
}
