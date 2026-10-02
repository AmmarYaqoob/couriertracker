import {
  isActiveStatus,
  isListStatus,
  LAST_HOUR_AFTER_MIN,
  ORDER_AS_OF,
  STATUS_VIEW,
  platformName,
  type ListStatus,
  type OrderRecord,
} from "../domain/order";
import { clock, isPlatform, zoneById, type Platform } from "../domain/rider";
import { AppError } from "../errors/appError";
import type { OrderRepository } from "../repositories/order.repository";

export interface OrderListQuery {
  status?: string;
  platform?: string;
}

export class OrderService {
  constructor(private readonly orders: OrderRepository) {}

  async list(query: OrderListQuery) {
    const status = readStatus(query.status);
    const platform = readPlatform(query.platform);
    const all = await this.orders.list();
    const orders = all.filter((order) => matches(order, status, platform));
    return {
      asOf: ORDER_AS_OF,
      summary: summarize(all),
      filters: { status, platform },
      count: orders.length,
      orders: orders.map(toView),
    };
  }

  async getById(id: string) {
    const order = await this.orders.findByCode(id);
    if (!order) throw new AppError(404, "Order not found");
    return { order: toView(order) };
  }
}

function summarize(orders: OrderRecord[]) {
  const active = orders.filter((order) => isActiveStatus(order.status));
  return {
    ordersInLastHour: orders.filter((order) => order.receivedMin > LAST_HOUR_AFTER_MIN).length,
    activeNow: active.length,
    waitingForDriver: orders.filter((order) => order.status === "waiting_driver").length,
    deliveredToday: orders.filter((order) => order.status === "done").length,
    cancelledToday: orders.filter((order) => order.status === "cancelled").length,
  };
}

function matches(order: OrderRecord, status: ListStatus, platform: Platform | "all"): boolean {
  if (platform !== "all" && order.platform !== platform) return false;
  if (status === "done") return order.status === "done";
  if (status === "cancelled") return order.status === "cancelled";
  return isActiveStatus(order.status);
}

function toView(order: OrderRecord) {
  const status = STATUS_VIEW[order.status];
  const from = zoneById(order.zoneId);
  const dropoff = zoneById(order.dropoffZoneId);
  return {
    id: order.id,
    platform: { id: order.platform, name: platformName(order.platform) },
    restaurant: order.restaurant,
    zone: from,
    dropoffZone: dropoff,
    route: order.zoneId === order.dropoffZoneId ? from.name : `${from.name} → ${dropoff.name}`,
    distanceKm: order.distanceKm,
    distanceLabel: `${order.distanceKm.toFixed(1)} km`,
    received: clock(order.receivedMin),
    deadline: clock(order.deadlineMin),
    rider: order.riderName,
    status: { value: order.status, label: status.label, tone: status.tone },
    outlook: outlookView(order),
  };
}

function outlookView(order: OrderRecord) {
  const outlook = order.outlook;
  if (outlook.kind === "margin") {
    const margin = outlook.marginMin ?? 0;
    return {
      kind: outlook.kind,
      label: `${margin >= 0 ? "+" : ""}${Math.round(margin)} min`,
      tone: marginBand(margin),
      marginMin: margin,
      lateMin: null,
      reason: null,
    };
  }
  if (outlook.kind === "late") {
    const lateMin = outlook.lateMin ?? 0;
    return {
      kind: outlook.kind,
      label: `Late ${Math.round(lateMin)} min`,
      tone: "crit" as const,
      marginMin: null,
      lateMin,
      reason: null,
    };
  }
  if (outlook.kind === "cancelled") {
    return {
      kind: outlook.kind,
      label: outlook.reason ?? "",
      tone: "muted" as const,
      marginMin: null,
      lateMin: null,
      reason: outlook.reason,
    };
  }
  return {
    kind: "on_time" as const,
    label: "On time",
    tone: "good" as const,
    marginMin: null,
    lateMin: null,
    reason: null,
  };
}

function marginBand(margin: number): "green" | "amber" | "red" {
  if (margin < 0) return "red";
  if (margin <= 5) return "amber";
  return "green";
}

function readStatus(value: string | undefined): ListStatus {
  if (value === undefined) return "active";
  if (isListStatus(value)) return value;
  throw new AppError(400, "Status must be active, done, or cancelled");
}

function readPlatform(value: string | undefined): Platform | "all" {
  if (value === undefined || value === "all") return "all";
  if (isPlatform(value)) return value;
  throw new AppError(400, "Platform must be uber_eats, wolt, lieferando, or all");
}
