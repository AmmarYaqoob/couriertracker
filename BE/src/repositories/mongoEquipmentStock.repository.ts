import type { Model } from "mongoose";
import type { CreateStockData, StockRecord } from "../domain/equipment";
import type { EquipmentStockDocument, EquipmentStockSchema } from "../models/equipmentStock.model";
import type { EquipmentStockRepository } from "./equipmentStock.repository";

function toRecord(doc: EquipmentStockDocument): StockRecord {
  return {
    item: doc.item,
    sequence: doc.sequence,
    inUse: doc.inUse,
    spare: doc.spare,
    reorderAt: doc.reorderAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoEquipmentStockRepository implements EquipmentStockRepository {
  constructor(private readonly model: Model<EquipmentStockSchema>) {}

  async create(data: CreateStockData): Promise<StockRecord> {
    const doc = await this.model.create(data);
    return toRecord(doc);
  }

  async list(): Promise<StockRecord[]> {
    const docs = await this.model.find().sort({ sequence: 1 });
    return docs.map(toRecord);
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}
