import {
  isIncidentListStatus,
  isIncidentSeverity,
  isIncidentStatus,
  isIncidentType,
  type IncidentListStatus,
  type IncidentSeverity,
  type IncidentStatus,
  type IncidentType,
} from "../domain/incident";
import { isZoneId, type ZoneId } from "../domain/rider";
import { AppError } from "../errors/appError";

export interface ParsedIncidentQuery {
  status: IncidentListStatus;
}

export interface ParsedCreateIncident {
  type: IncidentType;
  severity: IncidentSeverity;
  riderId: string | null;
  riderName: string | null;
  orderId: string | null;
  zoneId: ZoneId | null;
  description: string;
  reportedMin: number | undefined;
}

export function parseIncidentQuery(query: { status?: string }): ParsedIncidentQuery {
  if (query.status === undefined || query.status.trim() === "") {
    return { status: "all" };
  }
  if (!isIncidentListStatus(query.status)) {
    throw new AppError(400, "Unknown incident status filter");
  }
  return { status: query.status };
}

export function parseCreateIncident(input: unknown): ParsedCreateIncident {
  if (typeof input !== "object" || input === null) {
    throw new AppError(400, "Incident details are required");
  }
  const body = input as Record<string, unknown>;
  return {
    type: readType(body.type),
    severity: readSeverity(body.severity),
    riderId: readOptionalText(body.riderId, "Rider id", 40),
    riderName: readOptionalText(body.riderName, "Rider name", 80),
    orderId: readOptionalText(body.orderId, "Order id", 40),
    zoneId: readOptionalZone(body.zoneId),
    description: readDescription(body.description),
    reportedMin: body.reportedMin === undefined ? undefined : readMinutes(body.reportedMin, "Reported time"),
  };
}

export function parseIncidentStatus(input: unknown): IncidentStatus {
  if (typeof input !== "object" || input === null) {
    throw new AppError(400, "Status is required");
  }
  const status = (input as { status?: unknown }).status;
  if (typeof status !== "string" || !isIncidentStatus(status)) {
    throw new AppError(400, "Unknown incident status");
  }
  return status;
}

function readType(value: unknown): IncidentType {
  if (typeof value !== "string" || !isIncidentType(value)) {
    throw new AppError(400, "Unknown incident type");
  }
  return value;
}

function readSeverity(value: unknown): IncidentSeverity {
  if (typeof value !== "string" || !isIncidentSeverity(value)) {
    throw new AppError(400, "Unknown incident severity");
  }
  return value;
}

function readDescription(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(400, "Description is required");
  }
  const text = value.trim();
  if (text.length > 500) {
    throw new AppError(400, "Description is too long");
  }
  return text;
}

function readOptionalText(value: unknown, label: string, max: number): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new AppError(400, `${label} must be text`);
  }
  const text = value.trim();
  if (!text) return null;
  if (text.length > max) {
    throw new AppError(400, `${label} is too long`);
  }
  return text;
}

function readOptionalZone(value: unknown): ZoneId | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !isZoneId(value)) {
    throw new AppError(400, "Unknown zone");
  }
  return value;
}

function readMinutes(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AppError(400, `${label} must be a number of minutes`);
  }
  const minutes = Math.round(value);
  if (minutes < 0 || minutes > 24 * 60) {
    throw new AppError(400, `${label} is out of range`);
  }
  return minutes;
}
