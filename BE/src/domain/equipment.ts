export const PILOT_DAY = "2026-09-16";

export const VEHICLE_TYPES = ["bike", "e_bike", "scooter", "car"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  bike: "Bicycle",
  e_bike: "E-bike",
  scooter: "E-scooter",
  car: "Car",
};

export const VEHICLE_NAME_PREFIX: Record<VehicleType, string> = {
  bike: "Bike",
  e_bike: "E-bike",
  scooter: "E-scooter",
  car: "Car",
};

export const VEHICLE_STATUSES = ["in_service", "reserve", "maintenance", "defect"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const DAILY_KM: Record<VehicleType, number> = {
  bike: 30,
  e_bike: 45,
  scooter: 55,
  car: 90,
};

export const STOCK_STATUSES = ["OK", "Reorder"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

export interface VehicleRecord {
  id: string;
  sequence: number;
  type: VehicleType;
  label: string;
  status: VehicleStatus;
  kmSinceService: number;
  serviceIntervalKm: number;
  daysSinceService: number;
  serviceIntervalDays: number;
  batteryHealthPct: number | null;
  batteryCycles: number | null;
  assignedDriverId: string | null;
  assignedDriverName: string | null;
  downtimeMinutes7d: number;
  openDefects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateVehicleData = Omit<VehicleRecord, "createdAt" | "updatedAt">;

export interface StockRecord {
  item: string;
  sequence: number;
  inUse: number;
  spare: number;
  reorderAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateStockData = Omit<StockRecord, "createdAt" | "updatedAt">;

export function isVehicleType(value: string): value is VehicleType {
  return (VEHICLE_TYPES as readonly string[]).includes(value);
}

export function isVehicleStatus(value: string): value is VehicleStatus {
  return (VEHICLE_STATUSES as readonly string[]).includes(value);
}

export function serviceInDays(vehicle: Pick<
  VehicleRecord,
  "type" | "kmSinceService" | "serviceIntervalKm" | "daysSinceService" | "serviceIntervalDays"
>): number {
  const byKm = (vehicle.serviceIntervalKm - vehicle.kmSinceService) / DAILY_KM[vehicle.type];
  const byDays = vehicle.serviceIntervalDays - vehicle.daysSinceService;
  return Math.max(0, Math.min(byKm, byDays));
}

export function serviceUsedPct(vehicle: Pick<
  VehicleRecord,
  "kmSinceService" | "serviceIntervalKm" | "daysSinceService" | "serviceIntervalDays"
>): number {
  const byKm = (vehicle.kmSinceService / vehicle.serviceIntervalKm) * 100;
  const byDays = (vehicle.daysSinceService / vehicle.serviceIntervalDays) * 100;
  return Math.max(byKm, byDays);
}

export function stockStatus(spare: number, reorderAt: number): StockStatus {
  return spare < reorderAt ? "Reorder" : "OK";
}

export function statusLabel(status: VehicleStatus): string {
  return status.replace("_", " ");
}
