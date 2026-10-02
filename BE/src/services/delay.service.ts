import {
  DELAY_AS_OF,
  DELAY_AS_OF_MIN,
  DELAY_CAUSE_LABELS,
  DELAY_CAUSES,
  DRIVER_CONTROLLABLE_CAUSES,
  TIMELINE_STAGES,
  delayStatusLabel,
  delayZones,
  isDriverControllable,
  platformLabel,
  signedMinutes,
  vehicleLabel,
  zoneLabel,
  type ActualClock,
  type DelayCause,
  type DelayOrderRecord,
  type RestaurantWaitRecord,
  type StageClock,
  type TimelineStageKey,
} from "../domain/delay";
import type { OrderRecord } from "../domain/order";
import type { RestaurantRecord } from "../domain/reference";
import { PILOT_DAY, clock, isZoneId } from "../domain/rider";
import { AppError } from "../errors/appError";
import type { DelayRepository } from "../repositories/delay.repository";
import type { ListRepository } from "../repositories/list.repository";
import type { OrderRepository } from "../repositories/order.repository";

export class DelayService {
  constructor(
    private readonly delays: DelayRepository,
    private readonly orders: OrderRepository,
    private readonly restaurants: ListRepository<RestaurantRecord>,
  ) {}

  catalog() {
    return {
      asOf: PILOT_DAY,
      nowMin: DELAY_AS_OF_MIN,
      nowLabel: clock(DELAY_AS_OF_MIN),
      recordedAt: DELAY_AS_OF,
      causes: DELAY_CAUSES.map((cause) => ({
        value: cause,
        label: DELAY_CAUSE_LABELS[cause],
        driverControllable: isDriverControllable(cause),
      })),
      stages: TIMELINE_STAGES.map((stage) => ({ ...stage })),
      driverControllable: [...DRIVER_CONTROLLABLE_CAUSES],
      zones: delayZones(),
    };
  }

  async list() {
    const [delayOrders, waits, catalog] = await Promise.all([
      this.delays.listOrders(),
      this.delays.listWaits(),
      this.loadCatalog(),
    ]);
    const deliveries = [...delayOrders]
      .sort((a, b) => b.lateBy - a.lateBy)
      .map((row) => toDelivery(row, requireOrder(catalog.ordersByCode, row.orderId), catalog.restaurantsByName));
    return {
      asOf: PILOT_DAY,
      nowMin: DELAY_AS_OF_MIN,
      nowLabel: clock(DELAY_AS_OF_MIN),
      recordedAt: DELAY_AS_OF,
      lateCount: delayOrders.length,
      causes: buildCauses(delayOrders),
      restaurants: waits.map((row) => toRestaurant(row, requireRestaurant(catalog.restaurantsById, row.restaurantId))),
      count: deliveries.length,
      deliveries,
    };
  }

  async getById(orderId: string) {
    const row = await this.delays.findOrder(orderId);
    if (!row) throw new AppError(404, "Late delivery not found");
    const catalog = await this.loadCatalog();
    const delivery = toDelivery(row, requireOrder(catalog.ordersByCode, orderId), catalog.restaurantsByName);
    return { delivery };
  }

  async escalate(restaurantId: string) {
    const existing = await this.delays.findWait(restaurantId);
    if (!existing) throw new AppError(404, "Restaurant wait not found");
    if (!existing.escalate) throw new AppError(409, "This restaurant is not on the escalation list");
    const updated = await this.delays.escalate(restaurantId, existing.escalatedAt ?? DELAY_AS_OF_MIN);
    if (!updated) throw new AppError(404, "Restaurant wait not found");
    const catalog = await this.loadCatalog();
    return { restaurant: toRestaurant(updated, requireRestaurant(catalog.restaurantsById, restaurantId)) };
  }

  private async loadCatalog() {
    const [orders, restaurants] = await Promise.all([this.orders.list(), this.restaurants.list()]);
    return {
      ordersByCode: new Map(orders.map((order) => [order.id, order])),
      restaurantsById: new Map(restaurants.map((restaurant) => [restaurant.id, restaurant])),
      restaurantsByName: new Map(restaurants.map((restaurant) => [restaurant.name, restaurant])),
    };
  }
}

function buildCauses(orders: DelayOrderRecord[]) {
  const buckets = new Map<DelayCause, { count: number; minutes: number }>();
  for (const order of [...orders].sort((a, b) => a.seq - b.seq)) {
    const bucket = buckets.get(order.primaryCause) ?? { count: 0, minutes: 0 };
    bucket.count += 1;
    bucket.minutes += order.lateBy;
    buckets.set(order.primaryCause, bucket);
  }
  const total = orders.length;
  return [...buckets.entries()]
    .map(([cause, bucket]) => ({
      cause,
      label: DELAY_CAUSE_LABELS[cause],
      count: bucket.count,
      share: total ? bucket.count / total : 0,
      minutesLost: bucket.minutes,
      driverControllable: isDriverControllable(cause),
    }))
    .sort((a, b) => b.count - a.count);
}

function requireOrder(ordersByCode: Map<string, OrderRecord>, orderId: string): OrderRecord {
  const order = ordersByCode.get(orderId);
  if (!order) throw new AppError(500, `Order ${orderId} is missing from orders`);
  return order;
}

function requireRestaurant(restaurantsById: Map<string, RestaurantRecord>, restaurantId: string): RestaurantRecord {
  const restaurant = restaurantsById.get(restaurantId);
  if (!restaurant) throw new AppError(500, `Restaurant ${restaurantId} is missing from restaurants`);
  if (!isZoneId(restaurant.zoneId)) throw new AppError(500, `Restaurant ${restaurantId} has an unknown zone`);
  return restaurant;
}

function toRestaurant(row: RestaurantWaitRecord, restaurant: RestaurantRecord) {
  if (!isZoneId(restaurant.zoneId)) throw new AppError(500, `Restaurant ${restaurant.id} has an unknown zone`);
  return {
    restaurantId: row.restaurantId,
    name: restaurant.name,
    zoneId: restaurant.zoneId,
    zoneName: zoneLabel(restaurant.zoneId),
    pickups: row.pickups,
    medianWait: row.medianWait,
    p90Wait: row.p90Wait,
    lateCaused: row.lateCaused,
    daysOverThreshold: row.daysOverThreshold,
    escalate: row.escalate,
    escalatedAt: row.escalatedAt,
    escalatedAtLabel: row.escalatedAt === null ? null : clock(row.escalatedAt),
  };
}

function toDelivery(
  order: DelayOrderRecord,
  source: OrderRecord,
  restaurantsByName: Map<string, RestaurantRecord>,
) {
  const vehicle = vehicleLabel(order.vehicleType);
  const restaurant = restaurantsByName.get(source.restaurant);
  return {
    orderId: order.orderId,
    platform: source.platform,
    platformName: platformLabel(source.platform),
    zoneId: source.zoneId,
    zoneName: zoneLabel(source.zoneId),
    dropoffZoneId: source.dropoffZoneId,
    dropoffZoneName: zoneLabel(source.dropoffZoneId),
    restaurantId: restaurant?.id ?? null,
    restaurantName: source.restaurant,
    driverName: source.riderName,
    vehicleType: order.vehicleType,
    vehicleLabel: vehicle,
    driverLabel: source.riderName ? `${source.riderName} (${vehicle ?? "—"})` : null,
    statusLabel: delayStatusLabel(order.actual, DELAY_AS_OF_MIN),
    createdAt: order.createdAt,
    deadlineOriginal: order.deadlineOriginal,
    deadlineUpdated: order.deadlineUpdated,
    deadlineOriginalLabel: clock(order.deadlineOriginal),
    deadlineUpdatedLabel: clock(order.deadlineUpdated),
    deadlineChanged: order.deadlineUpdated !== order.deadlineOriginal,
    planned: order.planned,
    actual: order.actual,
    late: true,
    lateBy: order.lateBy,
    primaryCause: order.primaryCause,
    primaryCauseLabel: DELAY_CAUSE_LABELS[order.primaryCause],
    driverControllable: isDriverControllable(order.primaryCause),
    legs: order.legs.map((leg) => ({
      key: leg.key,
      label: leg.label,
      actual: leg.actual,
      overrun: leg.overrun,
      overrunLabel: signedMinutes(leg.overrun),
    })),
    stages: TIMELINE_STAGES.map((stage) => toStage(order, stage.key, stage.label)),
  };
}

function toStage(order: DelayOrderRecord, key: TimelineStageKey, label: string) {
  const planned = order.planned[key as keyof StageClock];
  const actual = order.actual[key as keyof ActualClock];
  const visible = actual !== null && actual <= DELAY_AS_OF_MIN ? actual : null;
  const delta = visible === null ? null : visible - planned;
  return {
    key,
    label,
    planned,
    actual: visible,
    plannedLabel: clock(planned),
    actualLabel: visible === null ? null : clock(visible),
    delta,
    deltaLabel: delta !== null && Math.abs(delta) >= 0.5 ? signedMinutes(delta) : null,
  };
}
