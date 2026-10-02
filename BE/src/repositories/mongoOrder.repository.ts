import type { Model } from "mongoose";
import type { CreateOrderData, OrderOutlook, OrderRecord, OrderStatus, OutlookKind } from "../domain/order";
import type { Platform, ZoneId } from "../domain/rider";
import type { OrderDocument, OrderSchema } from "../models/order.model";
import type { OrderRepository } from "./order.repository";

function toOutlook(value: OrderDocument["outlook"]): OrderOutlook {
  return {
    kind: value.kind as OutlookKind,
    marginMin: value.marginMin ?? null,
    lateMin: value.lateMin ?? null,
    reason: value.reason ?? null,
  };
}

function toRecord(doc: OrderDocument): OrderRecord {
  if (!doc.outlook) throw new Error(`Order ${doc.code} is missing outlook`);
  return {
    id: doc.code,
    platform: doc.platform as Platform,
    restaurant: doc.restaurant,
    zoneId: doc.zoneId as ZoneId,
    dropoffZoneId: doc.dropoffZoneId as ZoneId,
    distanceKm: doc.distanceKm,
    receivedMin: doc.receivedMin,
    deadlineMin: doc.deadlineMin,
    riderName: doc.riderName ?? null,
    status: doc.status as OrderStatus,
    outlook: toOutlook(doc.outlook),
  };
}

function toDoc(data: CreateOrderData) {
  return {
    code: data.id,
    platform: data.platform,
    restaurant: data.restaurant,
    zoneId: data.zoneId,
    dropoffZoneId: data.dropoffZoneId,
    distanceKm: data.distanceKm,
    receivedMin: data.receivedMin,
    deadlineMin: data.deadlineMin,
    riderName: data.riderName,
    status: data.status,
    outlook: data.outlook,
  };
}

export class MongoOrderRepository implements OrderRepository {
  constructor(private readonly model: Model<OrderSchema>) {}

  async insertMany(rows: CreateOrderData[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.model.insertMany(rows.map(toDoc));
    return docs.length;
  }

  async findByCode(code: string): Promise<OrderRecord | null> {
    const doc = await this.model.findOne({ code });
    return doc ? toRecord(doc) : null;
  }

  async list(): Promise<OrderRecord[]> {
    const docs = await this.model.find().sort({ receivedMin: -1, code: -1 });
    return docs.map(toRecord);
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}
