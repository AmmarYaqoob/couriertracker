import type { CreateDelayOrderData, CreateRestaurantWaitData, DelayOrderRecord, RestaurantWaitRecord } from "../domain/delay";

export interface DelayRepository {
  countOrders(): Promise<number>;
  countWaits(): Promise<number>;
  insertOrders(rows: CreateDelayOrderData[]): Promise<number>;
  insertWaits(rows: CreateRestaurantWaitData[]): Promise<number>;
  listOrders(): Promise<DelayOrderRecord[]>;
  listWaits(): Promise<RestaurantWaitRecord[]>;
  findOrder(orderId: string): Promise<DelayOrderRecord | null>;
  findWait(restaurantId: string): Promise<RestaurantWaitRecord | null>;
  escalate(restaurantId: string, escalatedAt: number): Promise<RestaurantWaitRecord | null>;
  stripCopiedLabels(): Promise<void>;
}
