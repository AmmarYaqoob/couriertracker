import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { PAYROLL_STATUSES } from "../domain/payroll";
import { EMPLOYMENT_TYPES } from "../domain/rider";

const checklistSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    done: { type: Boolean, required: true },
  },
  { _id: false },
);

const exceptionSchema = new Schema(
  {
    type: { type: String, required: true, trim: true },
    count: { type: Number, required: true },
  },
  { _id: false },
);

const payrollRunSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    eyebrow: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    blockedFoot: { type: String, required: true, trim: true },
    checklist: { type: [checklistSchema], required: true },
    exceptions: { type: [exceptionSchema], required: true },
  },
  { timestamps: true },
);

const payrollLineSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    periodId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, enum: EMPLOYMENT_TYPES },
    hourlyRate: { type: Number, required: true },
    hours: { type: Number, required: true },
    gross: { type: Number, required: true },
    status: { type: String, required: true, enum: PAYROLL_STATUSES },
    note: { type: String, required: true, trim: true },
    sortOrder: { type: Number, required: true },
  },
  { timestamps: true },
);

payrollLineSchema.index({ periodId: 1, sortOrder: 1 });
payrollLineSchema.index({ status: 1 });

export type PayrollRunSchema = InferSchemaType<typeof payrollRunSchema>;
export type PayrollRunDocument = HydratedDocument<PayrollRunSchema>;
export const PayrollRunModel = model("PayrollRun", payrollRunSchema);

export type PayrollLineSchema = InferSchemaType<typeof payrollLineSchema>;
export type PayrollLineDocument = HydratedDocument<PayrollLineSchema>;
export const PayrollLineModel = model("PayrollLine", payrollLineSchema);
