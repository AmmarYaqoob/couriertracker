import mongoose from "mongoose";
import { createApp } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import {
  delayRepository,
  documentRepository,
  employmentTypeRepository,
  incidentRepository,
  equipmentStockRepository,
  orderRepository,
  payrollRepository,
  platformRepository,
  restaurantRepository,
  riderRepository,
  userRepository,
  vehicleRepository,
  zoneRepository,
} from "./container";
import { seedDemoDelays } from "./seed/demoDelays";
import { seedDemoDocuments } from "./seed/demoDocuments";
import { seedDemoEquipment } from "./seed/demoEquipment";
import { seedDemoIncidents } from "./seed/demoIncidents";
import { seedDemoOrders } from "./seed/demoOrders";
import { seedDemoPayroll } from "./seed/demoPayroll";
import { seedEmploymentTypes, seedPlatforms, seedRestaurants, seedZones } from "./seed/demoReference";
import { seedDemoRiders } from "./seed/demoRiders";
import { seedDemoUsers } from "./seed/demoUsers";

async function shutdown(signal: string, close: () => void): Promise<void> {
  console.log(`${signal} received, closing`);
  close();
  await mongoose.disconnect();
  process.exit(0);
}

async function main(): Promise<void> {
  await connectDb();
  const seeded = await seedDemoUsers(userRepository);
  if (seeded > 0) {
    console.log(`Seeded ${seeded} demo users`);
  }
  const seededRiders = await seedDemoRiders(riderRepository);
  if (seededRiders > 0) {
    console.log(`Seeded ${seededRiders} demo riders`);
  }
  const seededDelays = await seedDemoDelays(delayRepository);
  if (seededDelays > 0) {
    console.log(`Seeded ${seededDelays} late deliveries`);
  }
  const seededDocuments = await seedDemoDocuments(documentRepository);
  if (seededDocuments > 0) {
    console.log(`Seeded ${seededDocuments} compliance documents`);
  }
  const seededIncidents = await seedDemoIncidents(incidentRepository);
  if (seededIncidents > 0) {
    console.log(`Seeded ${seededIncidents} demo incidents`);
  }
  const seededEquipment = await seedDemoEquipment(vehicleRepository, equipmentStockRepository);
  if (seededEquipment > 0) {
    console.log(`Seeded ${seededEquipment} fleet vehicles`);
  }
  const seededOrders = await seedDemoOrders(orderRepository);
  if (seededOrders > 0) {
    console.log(`Seeded ${seededOrders} demo orders`);
  }
  const seededPayroll = await seedDemoPayroll(payrollRepository);
  if (seededPayroll > 0) {
    console.log(`Seeded ${seededPayroll} payroll riders`);
  }
  const seededPlatforms = await seedPlatforms(platformRepository);
  const seededZones = await seedZones(zoneRepository);
  const seededRestaurants = await seedRestaurants(restaurantRepository);
  const seededEmploymentTypes = await seedEmploymentTypes(employmentTypeRepository);
  if (seededPlatforms + seededZones + seededRestaurants + seededEmploymentTypes > 0) {
    console.log(
      `Seeded ${seededPlatforms} platforms, ${seededZones} zones, ${seededRestaurants} restaurants, ${seededEmploymentTypes} employment types`,
    );
  }
  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT", () => server.close());
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM", () => server.close());
  });
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
