import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { DELAY_CAUSES, DELAY_LEG_KEYS } from "../domain/delay";

const stageSchema = new Schema(
  {
    accepted: { type: Number, required: true },
    arrivedPickup: { type: Number, required: true },
    pickedUp: { type: Number, required: true },
    arrivedDropoff: { type: Number, required: true },
    delivered: { type: Number, required: true },
  },
  { _id: false },
);

const actualSchema = new Schema(
  {
    accepted: { type: Number, default: null },
    arrivedPickup: { type: Number, default: null },
    pickedUp: { type: Number, default: null },
    arrivedDropoff: { type: Number, default: null },
    delivered: { type: Number, default: null },
  },
  { _id: false },
);

const legSchema = new Schema(
  {
    key: { type: String, required: true, enum: DELAY_LEG_KEYS },
    label: { type: String, required: true },
    actual: { type: Number, required: true },
    overrun: { type: Number, required: true },
  },
  { _id: false },
);

const delayOrderSchema = new Schema(
  {
    seq: { type: Number, required: true },
    code: { type: String, required: true, unique: true, trim: true },
    vehicleType: { type: String, default: null },
    createdAtMin: { type: Number, required: true },
    deadlineOriginal: { type: Number, required: true },
    deadlineUpdated: { type: Number, required: true },
    planned: { type: stageSchema, required: true },
    actual: { type: actualSchema, required: true },
    lateBy: { type: Number, required: true },
    primaryCause: { type: String, required: true, enum: DELAY_CAUSES },
    legs: { type: [legSchema], required: true },
  },
  { timestamps: true, collection: "delayOrders" },
);

delayOrderSchema.index({ seq: 1 });
delayOrderSchema.index({ lateBy: -1 });

const restaurantWaitSchema = new Schema(
  {
    seq: { type: Number, required: true },
    restaurantId: { type: String, required: true, unique: true, trim: true },
    pickups: { type: Number, required: true },
    medianWait: { type: Number, default: null },
    p90Wait: { type: Number, default: null },
    lateCaused: { type: Number, required: true },
    daysOverThreshold: { type: Number, required: true },
    escalate: { type: Boolean, required: true },
    escalatedAt: { type: Number, default: null },
  },
  { timestamps: true, collection: "restaurantWaits" },
);

restaurantWaitSchema.index({ seq: 1 });

export type DelayOrderSchema = InferSchemaType<typeof delayOrderSchema>;
export type RestaurantWaitSchema = InferSchemaType<typeof restaurantWaitSchema>;
export type DelayOrderDocument = HydratedDocument<DelayOrderSchema>;
export type RestaurantWaitDocument = HydratedDocument<RestaurantWaitSchema>;

export const DelayOrderModel = model("DelayOrder", delayOrderSchema);
export const RestaurantWaitModel = model("RestaurantWait", restaurantWaitSchema);
