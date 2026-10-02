import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../domain/equipment";

const vehicleSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    sequence: { type: Number, required: true },
    type: { type: String, required: true, enum: VEHICLE_TYPES },
    label: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: VEHICLE_STATUSES },
    kmSinceService: { type: Number, required: true },
    serviceIntervalKm: { type: Number, required: true },
    daysSinceService: { type: Number, required: true },
    serviceIntervalDays: { type: Number, required: true },
    batteryHealthPct: { type: Number, default: null },
    batteryCycles: { type: Number, default: null },
    assignedDriverId: { type: String, default: null },
    assignedDriverName: { type: String, default: null },
    downtimeMinutes7d: { type: Number, required: true, default: 0 },
    openDefects: { type: [String], default: [] },
  },
  { timestamps: true, collection: "vehicles" },
);

vehicleSchema.index({ sequence: 1 });
vehicleSchema.index({ status: 1 });

export type VehicleSchema = InferSchemaType<typeof vehicleSchema>;
export type VehicleDocument = HydratedDocument<VehicleSchema>;
export const VehicleModel = model("Vehicle", vehicleSchema);
