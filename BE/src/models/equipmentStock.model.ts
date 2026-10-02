import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const equipmentStockSchema = new Schema(
  {
    item: { type: String, required: true, unique: true, trim: true },
    sequence: { type: Number, required: true },
    inUse: { type: Number, required: true },
    spare: { type: Number, required: true },
    reorderAt: { type: Number, required: true },
  },
  { timestamps: true, collection: "equipment_stock" },
);

equipmentStockSchema.index({ sequence: 1 });

export type EquipmentStockSchema = InferSchemaType<typeof equipmentStockSchema>;
export type EquipmentStockDocument = HydratedDocument<EquipmentStockSchema>;
export const EquipmentStockModel = model("EquipmentStock", equipmentStockSchema);
