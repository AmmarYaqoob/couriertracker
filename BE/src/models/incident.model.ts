import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { INCIDENT_SEVERITIES, INCIDENT_SOURCES, INCIDENT_STATUSES, INCIDENT_TYPES } from "../domain/incident";

const incidentSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, enum: INCIDENT_TYPES },
    severity: { type: String, required: true, enum: INCIDENT_SEVERITIES },
    riderId: { type: String, default: null, trim: true },
    riderName: { type: String, default: null, trim: true },
    orderId: { type: String, default: null, trim: true },
    zoneId: { type: String, default: null, trim: true },
    description: { type: String, required: true, trim: true },
    reportedMin: { type: Number, required: true },
    status: { type: String, required: true, enum: INCIDENT_STATUSES },
    source: { type: String, required: true, enum: INCIDENT_SOURCES },
  },
  { timestamps: true, collection: "incidents" },
);

incidentSchema.index({ status: 1, reportedMin: -1 });
incidentSchema.index({ severity: 1 });

export type IncidentSchema = InferSchemaType<typeof incidentSchema>;
export type IncidentDocument = HydratedDocument<IncidentSchema>;
export const IncidentModel = model("Incident", incidentSchema);
