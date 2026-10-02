import type { CreateVehicleData, VehicleRecord } from "../domain/equipment";

export interface VehicleRepository {
  create(data: CreateVehicleData): Promise<VehicleRecord>;
  findByCode(code: string): Promise<VehicleRecord | null>;
  list(): Promise<VehicleRecord[]>;
  addDefect(code: string, description: string): Promise<VehicleRecord | null>;
  count(): Promise<number>;
}
