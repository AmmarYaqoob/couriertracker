import type { CreateOrderData, OrderRecord } from "../domain/order";

export interface OrderRepository {
  insertMany(rows: CreateOrderData[]): Promise<number>;
  findByCode(code: string): Promise<OrderRecord | null>;
  list(): Promise<OrderRecord[]>;
  count(): Promise<number>;
}
