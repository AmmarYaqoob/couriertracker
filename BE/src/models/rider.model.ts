import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ACTIVITIES, EMPLOYMENT_TYPES, PERFORMANCE_OUTCOMES, PLATFORMS, VEHICLE_TYPES, ZONES } from "../domain/rider";

const zoneIds = ZONES.map((zone) => zone.id);

const flagSchema = new Schema(
  {
    orderId: { type: String, required: true },
    kind: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const performanceSchema = new Schema(
  {
    deliveries: { type: Number, required: true },
    rawPct: { type: Number, default: null },
    adjustedPct: { type: Number, default: null },
    adjustedLow: { type: Number, default: null },
    adjustedHigh: { type: Number, default: null },
    controllableLate: { type: Number, required: true },
    excludedLate: { type: Number, required: true },
    attendancePct: { type: Number, default: null },
    cancellationPct: { type: Number, default: null },
    wrongOrMissingPct: { type: Number, default: null },
    sufficient: { type: Boolean, required: true },
    outcome: { type: String, required: true, enum: PERFORMANCE_OUTCOMES },
    explanation: { type: String, required: true },
    flags: { type: [flagSchema], default: [] },
  },
  { _id: false },
);

const riderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, enum: EMPLOYMENT_TYPES },
    contractType: { type: String, required: true, trim: true },
    hoursPerWeek: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    joined: { type: String, required: true, trim: true },
    contractEnd: { type: String, default: null },
    homeZoneId: { type: String, required: true, enum: zoneIds },
    platform: { type: String, required: true, enum: PLATFORMS },
    vehicle: {
      id: { type: String, required: true, trim: true },
      type: { type: String, required: true, enum: VEHICLE_TYPES },
      label: { type: String, required: true, trim: true },
      batteryHealthPct: { type: Number, default: null },
    },
    shift: {
      date: { type: String, required: true },
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      breakStart: { type: Number, required: true },
      breakMinutes: { type: Number, required: true },
      lateStartMin: { type: Number, required: true, default: 0 },
    },
    readiness: {
      status: { type: String, required: true, enum: ["passed", "failed", "not_done"] },
      issue: { type: String, default: null },
    },
    alnaifCoordinator: { type: String, required: true, trim: true },
    noShow: { type: Boolean, required: true, default: false },
    status: {
      activity: { type: String, required: true, enum: ACTIVITIES },
      zoneId: { type: String, required: true, enum: zoneIds },
      deliveries: { type: Number, required: true, default: 0 },
      onTime: { type: Number, required: true, default: 0 },
    },
    performance: { type: performanceSchema, required: true },
  },
  { timestamps: true },
);

riderSchema.index({ employmentType: 1 });
riderSchema.index({ homeZoneId: 1 });
riderSchema.index({ platform: 1 });

export type RiderSchema = InferSchemaType<typeof riderSchema>;
export type RiderDocument = HydratedDocument<RiderSchema>;
export const RiderModel = model("Rider", riderSchema);
