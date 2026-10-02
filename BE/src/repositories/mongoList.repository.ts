import type { Model } from "mongoose";
import type {
  EmploymentTypeRecord,
  PlatformPtod,
  PlatformRecord,
  PlatformWindow,
  RestaurantRecord,
  ZoneRecord,
} from "../domain/reference";
import type {
  EmploymentTypeDocument,
  PlatformDocument,
  RestaurantDocument,
  ZoneDocument,
} from "../models/reference.model";
import type { ListRepository } from "./list.repository";

function toWindow(value: { kind: string; size?: number | null }): PlatformWindow {
  if (value.kind === "rolling") return { kind: "rolling", size: value.size ?? undefined };
  return { kind: "daily" };
}

export function toPlatform(doc: PlatformDocument): PlatformRecord {
  const ptod = doc.ptod;
  const detail: PlatformPtod = {
    label: ptod.label,
    measuredEvent: ptod.measuredEvent,
    deadlineBasis: ptod.deadlineBasis,
    toleranceMin: ptod.toleranceMin,
    excludeRestaurantWait: ptod.excludeRestaurantWait,
    excludeCustomerWait: ptod.excludeCustomerWait,
    cancellations: ptod.cancellations,
    window: toWindow(ptod.window),
    batchRule: ptod.batchRule,
    target: ptod.target,
    verified: ptod.verified,
    source: ptod.source,
    notes: ptod.notes,
  };
  return {
    id: doc.id,
    name: doc.name,
    color: doc.color,
    revenuePerDelivery: doc.revenuePerDelivery,
    orderWeight: doc.orderWeight,
    ptod: detail,
  };
}

export function toZone(doc: ZoneDocument): ZoneRecord {
  return {
    id: doc.id,
    name: doc.name,
    city: doc.city,
    x: doc.x,
    y: doc.y,
    neighbors: [...doc.neighbors],
    reserveDrivers: doc.reserveDrivers,
    minutesPerOrder: doc.minutesPerOrder,
    demandShare: doc.demandShare,
  };
}

export function toRestaurant(doc: RestaurantDocument): RestaurantRecord {
  return {
    id: doc.id,
    name: doc.name,
    zoneId: doc.zoneId,
    cuisine: doc.cuisine,
    readinessDelayMean: doc.readinessDelayMean,
    readinessDelaySd: doc.readinessDelaySd,
  };
}

export function toEmploymentType(doc: EmploymentTypeDocument): EmploymentTypeRecord {
  const row: EmploymentTypeRecord = {
    id: doc.id,
    hoursPerWeek: doc.hoursPerWeek,
    contractType: doc.contractType,
    staffWeight: doc.staffWeight,
  };
  if (typeof doc.hourlyRate === "number") row.hourlyRate = doc.hourlyRate;
  return row;
}

export class MongoListRepository<T> implements ListRepository<T> {
  constructor(
    private readonly model: Model<any>,
    private readonly toRecord: (doc: any) => T,
  ) {}

  async insertMany(rows: T[]): Promise<number> {
    if (rows.length === 0) return 0;
    await this.model.insertMany(rows);
    return rows.length;
  }

  async list(): Promise<T[]> {
    const docs = await this.model.find().sort({ _id: 1 });
    return docs.map((doc) => this.toRecord(doc));
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}
