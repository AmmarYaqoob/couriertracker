import type { CreateUserData, UpdateUserData, UserListFilter, UserRecord } from "../domain/user";

export interface UserRepository {
  create(data: CreateUserData): Promise<UserRecord>;
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  list(filter: UserListFilter): Promise<UserRecord[]>;
  update(id: string, data: UpdateUserData): Promise<UserRecord | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
