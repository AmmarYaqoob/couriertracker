import { PILOT_DAY } from "../domain/rider";
import { ShiftModel } from "../models/shift.model";
import type { RiderRepository } from "../repositories/rider.repository";
import { buildPortalRiders } from "./portalRiders";

export async function seedDemoRiders(riders: RiderRepository): Promise<number> {
  await riders.clearCopiedPayAndPermit();
  if ((await riders.count()) > 0) return 0;

  const generated = buildPortalRiders();
  for (const rider of generated) {
    await riders.create(rider);
  }
  await ShiftModel.insertMany(
    generated.map((rider) => ({
      riderCode: rider.id,
      date: PILOT_DAY,
      start: rider.shiftStart,
      end: rider.shiftEnd,
      breakStart: rider.breakStart,
      breakMinutes: rider.breakMinutes,
      lateStartMin: rider.lateStartMin,
    })),
  );
  return generated.length;
}
