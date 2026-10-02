import type { Model } from "mongoose";
import type {
  ActualClock,
  CreateDelayOrderData,
  CreateRestaurantWaitData,
  DelayCause,
  DelayLeg,
  DelayOrderRecord,
  RestaurantWaitRecord,
  StageClock,
} from "../domain/delay";
import { isDelayCause } from "../domain/delay";
import type { DelayOrderDocument, DelayOrderSchema, RestaurantWaitDocument, RestaurantWaitSchema } from "../models/delay.model";
import type { DelayRepository } from "./delay.repository";

function num(value: number | null | undefined): number | null {
  return typeof value === "number" ? value : null;
}

function toStage(value: DelayOrderDocument["planned"]): StageClock {
  return {
    accepted: value.accepted,
    arrivedPickup: value.arrivedPickup,
    pickedUp: value.pickedUp,
    arrivedDropoff: value.arrivedDropoff,
    delivered: value.delivered,
  };
}

function toActual(value: DelayOrderDocument["actual"]): ActualClock {
  return {
    accepted: num(value.accepted),
    arrivedPickup: num(value.arrivedPickup),
    pickedUp: num(value.pickedUp),
    arrivedDropoff: num(value.arrivedDropoff),
    delivered: num(value.delivered),
  };
}

function toOrder(doc: DelayOrderDocument): DelayOrderRecord {
  if (!doc.planned || !doc.actual) throw new Error(`Delay order ${doc.code} is missing its timeline`);
  if (!isDelayCause(doc.primaryCause)) throw new Error(`Delay order ${doc.code} has an unknown cause`);
  return {
    seq: doc.seq,
    orderId: doc.code,
    vehicleType: doc.vehicleType ?? null,
    createdAt: doc.createdAtMin,
    deadlineOriginal: doc.deadlineOriginal,
    deadlineUpdated: doc.deadlineUpdated,
    planned: toStage(doc.planned),
    actual: toActual(doc.actual),
    lateBy: doc.lateBy,
    primaryCause: doc.primaryCause as DelayCause,
    legs: doc.legs.map(
      (leg): DelayLeg => ({
        key: leg.key as DelayLeg["key"],
        label: leg.label,
        actual: leg.actual,
        overrun: leg.overrun,
      }),
    ),
  };
}

function toWait(doc: RestaurantWaitDocument): RestaurantWaitRecord {
  return {
    seq: doc.seq,
    restaurantId: doc.restaurantId,
    pickups: doc.pickups,
    medianWait: num(doc.medianWait),
    p90Wait: num(doc.p90Wait),
    lateCaused: doc.lateCaused,
    daysOverThreshold: doc.daysOverThreshold,
    escalate: doc.escalate,
    escalatedAt: num(doc.escalatedAt),
  };
}

function orderDoc(data: CreateDelayOrderData) {
  return {
    seq: data.seq,
    code: data.orderId,
    vehicleType: data.vehicleType,
    createdAtMin: data.createdAt,
    deadlineOriginal: data.deadlineOriginal,
    deadlineUpdated: data.deadlineUpdated,
    planned: data.planned,
    actual: data.actual,
    lateBy: data.lateBy,
    primaryCause: data.primaryCause,
    legs: data.legs,
  };
}

export class MongoDelayRepository implements DelayRepository {
  constructor(
    private readonly orders: Model<DelayOrderSchema>,
    private readonly waits: Model<RestaurantWaitSchema>,
  ) {}

  async countOrders(): Promise<number> {
    return this.orders.countDocuments();
  }

  async countWaits(): Promise<number> {
    return this.waits.countDocuments();
  }

  async insertOrders(rows: CreateDelayOrderData[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.orders.insertMany(rows.map(orderDoc));
    return docs.length;
  }

  async insertWaits(rows: CreateRestaurantWaitData[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.waits.insertMany(rows);
    return docs.length;
  }

  async listOrders(): Promise<DelayOrderRecord[]> {
    const docs = await this.orders.find().sort({ seq: 1 });
    return docs.map(toOrder);
  }

  async listWaits(): Promise<RestaurantWaitRecord[]> {
    const docs = await this.waits.find().sort({ seq: 1 });
    return docs.map(toWait);
  }

  async findOrder(orderId: string): Promise<DelayOrderRecord | null> {
    const doc = await this.orders.findOne({ code: orderId });
    return doc ? toOrder(doc) : null;
  }

  async findWait(restaurantId: string): Promise<RestaurantWaitRecord | null> {
    const doc = await this.waits.findOne({ restaurantId });
    return doc ? toWait(doc) : null;
  }

  async stripCopiedLabels(): Promise<void> {
    await this.orders.collection.updateMany(
      {},
      {
        $unset: {
          platform: "",
          zoneId: "",
          dropoffZoneId: "",
          restaurantId: "",
          restaurantName: "",
          driverName: "",
        },
      },
    );
    await this.waits.collection.updateMany({}, { $unset: { name: "", zoneId: "" } });
  }

  async escalate(restaurantId: string, escalatedAt: number): Promise<RestaurantWaitRecord | null> {
    const doc = await this.waits.findOneAndUpdate(
      { restaurantId, escalatedAt: null },
      { escalatedAt },
      { new: true, runValidators: true },
    );
    if (doc) return toWait(doc);
    const existing = await this.waits.findOne({ restaurantId });
    return existing ? toWait(existing) : null;
  }
}
