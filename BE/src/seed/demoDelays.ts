import type { CreateDelayOrderData, CreateRestaurantWaitData, DelayCause, DelayLeg } from "../domain/delay";
import { isDelayCause } from "../domain/delay";
import type { DelayRepository } from "../repositories/delay.repository";
import delayOrdersJson from "./portalDelayOrders.json";
import restaurantWaitsJson from "./portalRestaurantWaits.json";

interface PortalDelayOrder {
  seq: number;
  orderId: string;
  vehicleType: string | null;
  createdAt: number;
  deadlineOriginal: number;
  deadlineUpdated: number;
  planned: CreateDelayOrderData["planned"];
  actual: CreateDelayOrderData["actual"];
  lateBy: number;
  primaryCause: string;
  legs: DelayLeg[];
}

interface PortalRestaurantWait {
  restaurantId: string;
  pickups: number;
  medianWait: number | null;
  p90Wait: number | null;
  lateCaused: number;
  daysOverThreshold: number;
  escalate: boolean;
}

function cause(value: string, orderId: string): DelayCause {
  if (!isDelayCause(value)) throw new Error(`Delay order ${orderId} has an unknown cause ${value}`);
  return value;
}

function buildOrders(): CreateDelayOrderData[] {
  return (delayOrdersJson as PortalDelayOrder[]).map((row) => ({
    seq: row.seq,
    orderId: row.orderId,
    vehicleType: row.vehicleType,
    createdAt: row.createdAt,
    deadlineOriginal: row.deadlineOriginal,
    deadlineUpdated: row.deadlineUpdated,
    planned: row.planned,
    actual: row.actual,
    lateBy: row.lateBy,
    primaryCause: cause(row.primaryCause, row.orderId),
    legs: row.legs,
  }));
}

function buildWaits(): CreateRestaurantWaitData[] {
  return (restaurantWaitsJson as PortalRestaurantWait[]).map((row, seq) => ({
    seq,
    restaurantId: row.restaurantId,
    pickups: row.pickups,
    medianWait: row.medianWait,
    p90Wait: row.p90Wait,
    lateCaused: row.lateCaused,
    daysOverThreshold: row.daysOverThreshold,
    escalate: row.escalate,
    escalatedAt: null,
  }));
}

export async function seedDemoDelays(delays: DelayRepository): Promise<number> {
  const [orders, waits] = await Promise.all([delays.countOrders(), delays.countWaits()]);
  let inserted = 0;
  if (orders === 0 && waits === 0) {
    inserted = await delays.insertOrders(buildOrders());
    await delays.insertWaits(buildWaits());
  }
  await delays.stripCopiedLabels();
  return inserted;
}
