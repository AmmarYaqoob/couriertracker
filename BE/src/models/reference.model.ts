import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const windowSchema = new Schema(
  {
    kind: { type: String, required: true, enum: ["rolling", "daily"] },
    size: { type: Number },
  },
  { _id: false },
);

const ptodSchema = new Schema(
  {
    label: { type: String, required: true },
    measuredEvent: { type: String, required: true },
    deadlineBasis: { type: String, required: true },
    toleranceMin: { type: Number, required: true },
    excludeRestaurantWait: { type: Boolean, required: true },
    excludeCustomerWait: { type: Boolean, required: true },
    cancellations: { type: String, required: true },
    window: { type: windowSchema, required: true },
    batchRule: { type: String, required: true },
    target: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    source: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { _id: false },
);

const platformSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    revenuePerDelivery: { type: Number, required: true },
    orderWeight: { type: Number, required: true },
    ptod: { type: ptodSchema, required: true },
  },
  { collection: "platforms" },
);

const zoneSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    neighbors: { type: [String], required: true },
    reserveDrivers: { type: Number, required: true },
    minutesPerOrder: { type: Number, required: true },
    demandShare: { type: Number, required: true },
  },
  { collection: "zones" },
);

const restaurantSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    zoneId: { type: String, required: true },
    cuisine: { type: String, required: true },
    readinessDelayMean: { type: Number, required: true },
    readinessDelaySd: { type: Number, required: true },
  },
  { collection: "restaurants" },
);

const employmentTypeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    hoursPerWeek: { type: Number, required: true },
    contractType: { type: String, required: true },
    staffWeight: { type: Number, required: true },
    hourlyRate: { type: Number },
  },
  { collection: "employmentTypes" },
);

export type PlatformSchema = InferSchemaType<typeof platformSchema>;
export type ZoneSchema = InferSchemaType<typeof zoneSchema>;
export type RestaurantSchema = InferSchemaType<typeof restaurantSchema>;
export type EmploymentTypeSchema = InferSchemaType<typeof employmentTypeSchema>;

export type PlatformDocument = HydratedDocument<PlatformSchema>;
export type ZoneDocument = HydratedDocument<ZoneSchema>;
export type RestaurantDocument = HydratedDocument<RestaurantSchema>;
export type EmploymentTypeDocument = HydratedDocument<EmploymentTypeSchema>;

export const PlatformModel = model("Platform", platformSchema);
export const ZoneModel = model("Zone", zoneSchema);
export const RestaurantModel = model("Restaurant", restaurantSchema);
export const EmploymentTypeModel = model("EmploymentType", employmentTypeSchema);
