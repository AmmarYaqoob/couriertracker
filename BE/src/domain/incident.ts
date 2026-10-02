import { PILOT_DAY, ZONES, clock, zoneById, type ZoneId } from "./rider";

export const INCIDENT_AS_OF = PILOT_DAY;

export const INCIDENT_TYPES = [
  "Vehicle or equipment failure",
  "Accident (rider safe)",
  "Order damaged",
  "Wrong or missing items",
  "Customer not available",
  "Restaurant problem",
  "App or connectivity problem",
  "Safety concern",
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

export const INCIDENT_SEVERITIES = ["Low", "Medium", "High"] as const;
export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export const INCIDENT_STATUSES = ["open", "resolved"] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const INCIDENT_LIST_STATUSES = ["open", "resolved", "all"] as const;
export type IncidentListStatus = (typeof INCIDENT_LIST_STATUSES)[number];

export const INCIDENT_SOURCES = ["Order feed", "Logged"] as const;
export type IncidentSource = (typeof INCIDENT_SOURCES)[number];

export interface IncidentRecord {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  riderId: string | null;
  riderName: string | null;
  orderId: string | null;
  zoneId: ZoneId | null;
  description: string;
  reportedMin: number;
  status: IncidentStatus;
  source: IncidentSource;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateIncidentData = Omit<IncidentRecord, "createdAt" | "updatedAt">;

export function isIncidentType(value: string): value is IncidentType {
  return (INCIDENT_TYPES as readonly string[]).includes(value);
}

export function isIncidentSeverity(value: string): value is IncidentSeverity {
  return (INCIDENT_SEVERITIES as readonly string[]).includes(value);
}

export function isIncidentStatus(value: string): value is IncidentStatus {
  return (INCIDENT_STATUSES as readonly string[]).includes(value);
}

export function isIncidentListStatus(value: string): value is IncidentListStatus {
  return (INCIDENT_LIST_STATUSES as readonly string[]).includes(value);
}

export function isIncidentSource(value: string): value is IncidentSource {
  return (INCIDENT_SOURCES as readonly string[]).includes(value);
}

export function incidentWhere(zoneId: ZoneId | null): string {
  return zoneId ? zoneById(zoneId).name : "\u2014";
}

export function incidentReported(reportedMin: number): string {
  return clock(reportedMin);
}

export function incidentZones(): Array<{ id: ZoneId; name: string; city: string }> {
  return ZONES.map((zone) => ({ ...zone }));
}
