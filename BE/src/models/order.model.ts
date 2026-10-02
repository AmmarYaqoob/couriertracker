import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ORDER_STATUSES, OUTLOOK_KINDS } from "../domain/order";
import { PLATFORMS, ZONES } from "../domain/rider";

const zoneIds = ZONES.map((zone) => zone.id);

const outlookSchema = new Schema(
  {
    kind: { type: String, required: true, enum: OUTLOOK_KINDS },
    marginMin: { type: Number, default: null },
    lateMin: { type: Number, default: null },
    reason: { type: String, default: null },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    platform: { type: String, required: true, enum: PLATFORMS },
    restaurant: { type: String, required: true, trim: true },
    zoneId: { type: String, required: true, enum: zoneIds },
    dropoffZoneId: { type: String, required: true, enum: zoneIds },
    distanceKm: { type: Number, required: true },
    receivedMin: { type: Number, required: true },
    deadlineMin: { type: Number, required: true },
    riderName: { type: String, default: null },
    status: { type: String, required: true, enum: ORDER_STATUSES },
    outlook: { type: outlookSchema, required: true },
  },
  { timestamps: true },
);

orderSchema.index({ status: 1, receivedMin: -1 });

export type OrderSchema = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderSchema>;
export const OrderModel = model("Order", orderSchema);
