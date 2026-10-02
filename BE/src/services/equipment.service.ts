import {
  PILOT_DAY,
  VEHICLE_TYPE_LABELS,
  serviceInDays,
  serviceUsedPct,
  statusLabel,
  stockStatus,
  type StockRecord,
  type VehicleRecord,
  type VehicleType,
} from "../domain/equipment";
import { AppError } from "../errors/appError";
import type { EquipmentStockRepository } from "../repositories/equipmentStock.repository";
import type { VehicleRepository } from "../repositories/vehicle.repository";
import { parseDefectDescription } from "./equipmentInput";

export class EquipmentService {
  constructor(
    private readonly vehicles: VehicleRepository,
    private readonly stock: EquipmentStockRepository,
  ) {}

  async list() {
    const [vehicles, stock] = await Promise.all([this.vehicles.list(), this.stock.list()]);
    return {
      asOf: PILOT_DAY,
      summary: summarize(vehicles),
      count: vehicles.length,
      vehicles: vehicles.map(toListItem),
      stock: stock.map(toStockItem),
    };
  }

  async getById(id: string) {
    return { vehicle: toListItem(await this.require(id)) };
  }

  async addDefect(id: string, input: unknown) {
    const description = parseDefectDescription(input);
    await this.require(id);
    const updated = await this.vehicles.addDefect(id, description);
    if (!updated) throw new AppError(404, "Vehicle not found");
    return { vehicle: toListItem(updated) };
  }

  private async require(id: string): Promise<VehicleRecord> {
    const vehicle = await this.vehicles.findByCode(id);
    if (!vehicle) throw new AppError(404, "Vehicle not found");
    return vehicle;
  }
}

function summarize(vehicles: VehicleRecord[]) {
  const inService = vehicles.filter((vehicle) => vehicle.status === "in_service");
  const reserve = vehicles.filter((vehicle) => vehicle.status === "reserve");
  const due = vehicles.filter((vehicle) => serviceInDays(vehicle) <= 7);
  const withDefects = vehicles.filter((vehicle) => vehicle.openDefects.length > 0);
  const downtimeHours = Number((vehicles.reduce((sum, vehicle) => sum + vehicle.downtimeMinutes7d, 0) / 60).toFixed(1));
  const typeCounts = new Map<string, { type: VehicleType; label: string; count: number }>();
  for (const vehicle of vehicles) {
    const label = VEHICLE_TYPE_LABELS[vehicle.type];
    const current = typeCounts.get(label);
    if (current) current.count += 1;
    else typeCounts.set(label, { type: vehicle.type, label, count: 1 });
  }
  const reserveLabels = reserve.map((vehicle) => VEHICLE_TYPE_LABELS[vehicle.type]);
  return {
    vehiclesInService: inService.length,
    typeBreakdown: [...typeCounts.values()],
    typeBreakdownLabel: [...typeCounts.values()].map((entry) => `${entry.count} ${entry.label}`).join(" · "),
    reserveReady: reserve.length,
    reserveFoot: reserveLabels.join(", "),
    serviceDueWithin7Days: due.length,
    vehiclesWithOpenDefects: withDefects.length,
    downtimeHours7d: downtimeHours,
    downtimeFoot: `${downtimeHours.toFixed(1)} h downtime in 7 days`,
  };
}

function toListItem(vehicle: VehicleRecord) {
  const days = serviceInDays(vehicle);
  return {
    id: vehicle.id,
    label: vehicle.label,
    type: vehicle.type,
    typeLabel: VEHICLE_TYPE_LABELS[vehicle.type],
    status: vehicle.status,
    statusLabel: statusLabel(vehicle.status),
    assignedDriverId: vehicle.assignedDriverId,
    assignedTo: vehicle.assignedDriverName ?? "Reserve pool",
    kmSinceService: vehicle.kmSinceService,
    serviceIntervalKm: vehicle.serviceIntervalKm,
    daysSinceService: vehicle.daysSinceService,
    serviceIntervalDays: vehicle.serviceIntervalDays,
    serviceUsedPct: serviceUsedPct(vehicle),
    serviceInDays: days,
    overdue: days < 1,
    batteryHealthPct: vehicle.batteryHealthPct,
    defects: vehicle.openDefects,
  };
}

function toStockItem(item: StockRecord) {
  return {
    item: item.item,
    inUse: item.inUse,
    spare: item.spare,
    reorderAt: item.reorderAt,
    status: stockStatus(item.spare, item.reorderAt),
  };
}
