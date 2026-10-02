import type { Model } from "mongoose";
import type { CreateVehicleData, VehicleRecord, VehicleStatus, VehicleType } from "../domain/equipment";
import { isVehicleStatus, isVehicleType } from "../domain/equipment";
import type { VehicleDocument, VehicleSchema } from "../models/vehicle.model";
import type { VehicleRepository } from "./vehicle.repository";

function toRecord(doc: VehicleDocument): VehicleRecord {
  if (!isVehicleType(doc.type) || !isVehicleStatus(doc.status)) {
    throw new Error(`Vehicle ${doc.code} has an unknown type or status`);
  }
  return {
    id: doc.code,
    sequence: doc.sequence,
    type: doc.type,
    label: doc.label,
    status: doc.status,
    kmSinceService: doc.kmSinceService,
    serviceIntervalKm: doc.serviceIntervalKm,
    daysSinceService: doc.daysSinceService,
    serviceIntervalDays: doc.serviceIntervalDays,
    batteryHealthPct: doc.batteryHealthPct ?? null,
    batteryCycles: doc.batteryCycles ?? null,
    assignedDriverId: doc.assignedDriverId ?? null,
    assignedDriverName: doc.assignedDriverName ?? null,
    downtimeMinutes7d: doc.downtimeMinutes7d,
    openDefects: [...doc.openDefects],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toDoc(data: CreateVehicleData) {
  return {
    code: data.id,
    sequence: data.sequence,
    type: data.type satisfies VehicleType,
    label: data.label,
    status: data.status satisfies VehicleStatus,
    kmSinceService: data.kmSinceService,
    serviceIntervalKm: data.serviceIntervalKm,
    daysSinceService: data.daysSinceService,
    serviceIntervalDays: data.serviceIntervalDays,
    batteryHealthPct: data.batteryHealthPct,
    batteryCycles: data.batteryCycles,
    assignedDriverId: data.assignedDriverId,
    assignedDriverName: data.assignedDriverName,
    downtimeMinutes7d: data.downtimeMinutes7d,
    openDefects: data.openDefects,
  };
}

export class MongoVehicleRepository implements VehicleRepository {
  constructor(private readonly model: Model<VehicleSchema>) {}

  async create(data: CreateVehicleData): Promise<VehicleRecord> {
    const doc = await this.model.create(toDoc(data));
    return toRecord(doc);
  }

  async findByCode(code: string): Promise<VehicleRecord | null> {
    const doc = await this.model.findOne({ code });
    return doc ? toRecord(doc) : null;
  }

  async list(): Promise<VehicleRecord[]> {
    const docs = await this.model.find().sort({ sequence: 1 });
    return docs.map(toRecord);
  }

  async addDefect(code: string, description: string): Promise<VehicleRecord | null> {
    const doc = await this.model.findOneAndUpdate(
      { code },
      { $push: { openDefects: description } },
      { new: true, runValidators: true },
    );
    return doc ? toRecord(doc) : null;
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}
