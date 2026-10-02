import { Schema, model } from "mongoose";

const shiftSchema = new Schema(
  {
    riderCode: { type: String, required: true },
    date: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    breakStart: { type: Number, required: true },
    breakMinutes: { type: Number, required: true },
    lateStartMin: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

shiftSchema.index({ riderCode: 1, date: 1 }, { unique: true });

export const ShiftModel = model("Shift", shiftSchema);
