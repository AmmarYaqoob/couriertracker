import type { CreateStockData, StockRecord } from "../domain/equipment";

export interface EquipmentStockRepository {
  create(data: CreateStockData): Promise<StockRecord>;
  list(): Promise<StockRecord[]>;
  count(): Promise<number>;
}
