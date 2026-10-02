import { PILOT_DAY, PLATFORM_NAMES, ZONES, clock, zoneById, type Platform, type ZoneId } from "./rider";

/** Simulated minute the delays page uses on first paint (19:05). */
export const DELAY_AS_OF_MIN = 1145;
export const DELAY_AS_OF = `${PILOT_DAY}T${clock(DELAY_AS_OF_MIN)}:00`;

export const DELAY_CAUSES = [
  "capacity",
  "restaurant",
  "travel_to_pickup",
  "travel_to_customer",
  "handover",
  "equipment",
  "none",
] as const;

export type DelayCause = (typeof DELAY_CAUSES)[number];

export const DELAY_CAUSE_LABELS: Record<DelayCause, string> = {
  capacity: "Waiting for a free driver",
  restaurant: "Restaurant not ready",
  travel_to_pickup: "Late arrival at restaurant",
  travel_to_customer: "Travel to customer",
  handover: "Customer handover",
  equipment: "Equipment or vehicle problem",
  none: "No delay",
};

export const DRIVER_CONTROLLABLE_CAUSES: readonly DelayCause[] = ["travel_to_pickup", "travel_to_customer"];

export const TIMELINE_STAGES = [
  { key: "accepted", label: "Order accepted" },
  { key: "arrivedPickup", label: "Restaurant arrival" },
  { key: "pickedUp", label: "Food collected" },
  { key: "arrivedDropoff", label: "Arrival at customer" },
  { key: "delivered", label: "Customer handover" },
] as const;

export type TimelineStageKey = (typeof TIMELINE_STAGES)[number]["key"];

export const DELAY_LEG_KEYS = [
  "assignment",
  "to_pickup",
  "restaurant_wait",
  "to_customer",
  "handover",
] as const;

export type DelayLegKey = (typeof DELAY_LEG_KEYS)[number];

export interface StageClock {
  accepted: number;
  arrivedPickup: number;
  pickedUp: number;
  arrivedDropoff: number;
  delivered: number;
}

export interface ActualClock {
  accepted: number | null;
  arrivedPickup: number | null;
  pickedUp: number | null;
  arrivedDropoff: number | null;
  delivered: number | null;
}

export interface DelayLeg {
  key: DelayLegKey;
  label: string;
  actual: number;
  overrun: number;
}

export interface DelayOrderRecord {
  seq: number;
  orderId: string;
  vehicleType: string | null;
  createdAt: number;
  deadlineOriginal: number;
  deadlineUpdated: number;
  planned: StageClock;
  actual: ActualClock;
  lateBy: number;
  primaryCause: DelayCause;
  legs: DelayLeg[];
}

export interface RestaurantWaitRecord {
  seq: number;
  restaurantId: string;
  pickups: number;
  medianWait: number | null;
  p90Wait: number | null;
  lateCaused: number;
  daysOverThreshold: number;
  escalate: boolean;
  escalatedAt: number | null;
}

export type CreateDelayOrderData = DelayOrderRecord;
export type CreateRestaurantWaitData = RestaurantWaitRecord;

export function isDelayCause(value: string): value is DelayCause {
  return (DELAY_CAUSES as readonly string[]).includes(value);
}

export function isDriverControllable(cause: DelayCause): boolean {
  return DRIVER_CONTROLLABLE_CAUSES.includes(cause);
}

export function platformLabel(platform: Platform): string {
  return PLATFORM_NAMES[platform];
}

export function zoneLabel(zoneId: ZoneId): string {
  return zoneById(zoneId).name;
}

export function vehicleLabel(vehicleType: string | null): string | null {
  if (!vehicleType) return null;
  return vehicleType.replace("_", "-");
}

export function signedMinutes(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded} min`;
}

export function delayZones(): Array<{ id: ZoneId; name: string; city: string }> {
  return ZONES.map((zone) => ({ id: zone.id, name: zone.name, city: zone.city }));
}

/** Same stage rule the delays page uses for a completed, non-cancelled order. */
export function delayStatusLabel(actual: ActualClock, nowMin: number): string {
  const stage =
    actual.delivered !== null && actual.delivered <= nowMin
      ? "done"
      : actual.arrivedDropoff !== null && actual.arrivedDropoff <= nowMin
        ? "at_customer"
        : actual.pickedUp !== null && actual.pickedUp <= nowMin
          ? "to_customer"
          : actual.arrivedPickup !== null && actual.arrivedPickup <= nowMin
            ? "at_pickup"
            : actual.accepted !== null && actual.accepted <= nowMin
              ? "to_pickup"
              : "waiting_driver";
  return stage.replace("_", " ");
}
