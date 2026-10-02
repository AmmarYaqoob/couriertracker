import mongoose from "mongoose";
import { connectDb } from "../src/config/db";
import { RiderModel } from "../src/models/rider.model";
import { ShiftModel } from "../src/models/shift.model";
import { riderRepository } from "../src/container";
import { seedDemoRiders } from "../src/seed/demoRiders";
import { buildPortalRiders } from "../src/seed/portalRiders";

async function main(): Promise<void> {
  const sample = buildPortalRiders();
  console.log("generated", sample.length, sample[0].id, sample[0].name, sample[0].employmentType, sample[0].homeZoneId);
  await connectDb();
  await RiderModel.deleteMany({});
  await ShiftModel.deleteMany({});
  const seeded = await seedDemoRiders(riderRepository);
  const shifts = await ShiftModel.countDocuments();
  console.log("inserted riders", seeded, "shifts", shifts);
  await mongoose.disconnect();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
