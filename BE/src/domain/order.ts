import { PILOT_DAY, PLATFORM_NAMES, type Platform, type ZoneId } from "./rider";

export const ORDER_AS_OF = `${PILOT_DAY}T22:14:00`;
export const PILOT_NOW_MIN = 22 * 60 + 14;
export const LAST_HOUR_AFTER_MIN = PILOT_NOW_MIN - 60;

export const ORDER_STATUSES = [
  "waiting_driver",
  "to_pickup",
  "at_pickup",
  "to_customer",
  "at_customer",
  "done",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const LIST_STATUSES = ["active", "done", "cancelled"] as const;
export type ListStatus = (typeof LIST_STATUSES)[number];

export const OUTLOOK_KINDS = ["margin", "on_time", "late", "cancelled"] as const;
export type OutlookKind = (typeof OUTLOOK_KINDS)[number];

export const STATUS_VIEW: Record<OrderStatus, { label: string; tone: "warn" | "info" | "good" | "crit" }> = {
  waiting_driver: { label: "Waiting for driver", tone: "warn" },
  to_pickup: { label: "Accepted", tone: "info" },
  at_pickup: { label: "At restaurant", tone: "info" },
  to_customer: { label: "Picked up", tone: "info" },
  at_customer: { label: "At customer", tone: "info" },
  done: { label: "Delivered", tone: "good" },
  cancelled: { label: "Cancelled", tone: "crit" },
};

export interface OrderOutlook {
  kind: OutlookKind;
  marginMin: number | null;
  lateMin: number | null;
  reason: string | null;
}

export interface OrderRecord {
  id: string;
  platform: Platform;
  restaurant: string;
  zoneId: ZoneId;
  dropoffZoneId: ZoneId;
  distanceKm: number;
  receivedMin: number;
  deadlineMin: number;
  riderName: string | null;
  status: OrderStatus;
  outlook: OrderOutlook;
}

export type CreateOrderData = OrderRecord;

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isListStatus(value: string): value is ListStatus {
  return (LIST_STATUSES as readonly string[]).includes(value);
}

export function isActiveStatus(status: OrderStatus): boolean {
  return status !== "done" && status !== "cancelled";
}

export function platformName(platform: Platform): string {
  return PLATFORM_NAMES[platform];
}
