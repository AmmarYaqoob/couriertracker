import type { EquipmentStockRepository } from "../repositories/equipmentStock.repository";
import type { VehicleRepository } from "../repositories/vehicle.repository";
import { buildPortalFleet } from "./portalFleet";

export async function seedDemoEquipment(
  vehicles: VehicleRepository,
  stock: EquipmentStockRepository,
): Promise<number> {
  if ((await vehicles.count()) > 0) return 0;

  const generated = buildPortalFleet();
  for (const vehicle of generated.vehicles) {
    await vehicles.create(vehicle);
  }
  if ((await stock.count()) === 0) {
    for (const item of generated.stock) {
      await stock.create(item);
    }
  }
  return generated.vehicles.length;
}
