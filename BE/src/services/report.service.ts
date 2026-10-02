import { DELAY_CAUSE_LABELS, type DelayOrderRecord } from "../domain/delay";
import type { OrderRecord } from "../domain/order";
import type { PlatformRecord } from "../domain/reference";
import type { ReportFact, ReportPage } from "../domain/report";
import { PILOT_DAY, PLATFORM_NAMES, zoneById, type EmploymentType, type Platform, type RiderRecord } from "../domain/rider";
import type { DelayRepository } from "../repositories/delay.repository";
import type { ListRepository } from "../repositories/list.repository";
import type { OrderRepository } from "../repositories/order.repository";
import type { RiderRepository } from "../repositories/rider.repository";

const ON_TIME = "On time";
const LATE = "Late";
const UNASSIGNED = "Unassigned";
const UNKNOWN = "Unknown";

export class ReportService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly delays: DelayRepository,
    private readonly riders: RiderRepository,
    private readonly platforms: ListRepository<PlatformRecord>,
  ) {}

  async list(): Promise<ReportPage> {
    const [orders, delays, riders, platforms] = await Promise.all([
      this.orders.list(),
      this.delays.listOrders(),
      this.riders.list(),
      this.platforms.list(),
    ]);
    const delayByOrder = new Map(delays.map((row) => [row.orderId, row]));
    const revenueByPlatform = new Map(platforms.map((row) => [row.id, row.revenuePerDelivery]));
    const employmentByRider = employmentIndex(riders);
    const rows = orders.map((order) =>
      toFact(order, delayByOrder.get(order.id), revenueByPlatform, employmentByRider),
    );
    return {
      asOf: PILOT_DAY,
      count: rows.length,
      platforms: platforms.map((row) => ({ id: row.id, name: row.name })),
      rows,
    };
  }
}

function toFact(
  order: OrderRecord,
  delay: DelayOrderRecord | undefined,
  revenueByPlatform: Map<string, number>,
  employmentByRider: Map<string, EmploymentType | typeof UNKNOWN>,
): ReportFact {
  const delivered = order.status === "done";
  const late = delivered && order.outlook.kind === "late";
  const onTime = delivered && order.outlook.kind === "on_time";
  return {
    platformId: order.platform,
    platform: PLATFORM_NAMES[order.platform],
    zone: zoneById(order.zoneId).name,
    restaurant: order.restaurant,
    driver: order.riderName ?? UNASSIGNED,
    delayCause: delayCause(order, delay),
    hour: hourLabel(order.receivedMin),
    employment: employmentLabel(order, employmentByRider),
    delivered,
    onTime,
    late,
    cancelled: order.status === "cancelled",
    deliveryMinutes: deliveryMinutes(order, delay),
    revenue: delivered ? (revenueByPlatform.get(order.platform) ?? 0) : 0,
  };
}

function delayCause(order: OrderRecord, delay: DelayOrderRecord | undefined): string {
  if (delay) return DELAY_CAUSE_LABELS[delay.primaryCause];
  if (order.status === "done" && order.outlook.kind === "late") return LATE;
  return ON_TIME;
}

function employmentLabel(
  order: OrderRecord,
  employmentByRider: Map<string, EmploymentType | typeof UNKNOWN>,
): string {
  if (!order.riderName) return UNASSIGNED;
  return employmentByRider.get(riderKey(order.riderName, order.platform)) ?? UNKNOWN;
}

function employmentIndex(riders: RiderRecord[]): Map<string, EmploymentType | typeof UNKNOWN> {
  const grouped = new Map<string, Set<EmploymentType>>();
  for (const rider of riders) {
    const key = riderKey(rider.name, rider.platform);
    const types = grouped.get(key) ?? new Set<EmploymentType>();
    types.add(rider.employmentType);
    grouped.set(key, types);
  }
  const index = new Map<string, EmploymentType | typeof UNKNOWN>();
  for (const [key, types] of grouped) {
    const [only] = types;
    index.set(key, types.size === 1 && only ? only : UNKNOWN);
  }
  return index;
}

function riderKey(name: string, platform: Platform): string {
  return `${name}\u0000${platform}`;
}

function hourLabel(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24;
  return `${String(hour).padStart(2, "0")}:00`;
}

function deliveryMinutes(order: OrderRecord, delay: DelayOrderRecord | undefined): number | null {
  if (order.status !== "done") return null;
  if (delay?.actual.delivered !== null && delay?.actual.delivered !== undefined) {
    return delay.actual.delivered - delay.createdAt;
  }
  const windowMinutes = order.deadlineMin - order.receivedMin;
  if (order.outlook.kind === "late" && order.outlook.lateMin !== null) {
    return windowMinutes + order.outlook.lateMin;
  }
  return windowMinutes;
}
