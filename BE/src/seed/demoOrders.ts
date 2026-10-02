import type { CreateOrderData } from "../domain/order";
import type { OrderRepository } from "../repositories/order.repository";
import portalOrders from "./portalOrders.json";

const orders = portalOrders as CreateOrderData[];

export function buildDemoOrders(): CreateOrderData[] {
  return orders;
}

export async function seedDemoOrders(repository: OrderRepository): Promise<number> {
  if ((await repository.count()) > 0) return 0;
  await repository.insertMany(orders);
  return orders.length;
}
