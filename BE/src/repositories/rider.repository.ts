import type { CreateRiderData, RiderRecord } from "../domain/rider";

export interface RiderRepository {
  create(data: CreateRiderData): Promise<RiderRecord>;
  findByCode(code: string): Promise<RiderRecord | null>;
  list(): Promise<RiderRecord[]>;
  update(code: string, data: CreateRiderData): Promise<RiderRecord | null>;
  delete(code: string): Promise<boolean>;
  count(): Promise<number>;
  clearCopiedPayAndPermit(): Promise<void>;
}
