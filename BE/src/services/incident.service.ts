import {
  INCIDENT_AS_OF,
  INCIDENT_SEVERITIES,
  INCIDENT_TYPES,
  incidentReported,
  incidentWhere,
  incidentZones,
  type CreateIncidentData,
  type IncidentListStatus,
  type IncidentRecord,
} from "../domain/incident";
import { AppError, isDuplicateKey } from "../errors/appError";
import type { IncidentRepository } from "../repositories/incident.repository";
import { parseCreateIncident, parseIncidentQuery, parseIncidentStatus } from "./incidentInput";

export interface IncidentListQuery {
  status?: string;
}

export class IncidentService {
  constructor(private readonly incidents: IncidentRepository) {}

  catalog() {
    return {
      asOf: INCIDENT_AS_OF,
      types: INCIDENT_TYPES.map((type) => ({ value: type, label: type })),
      severities: INCIDENT_SEVERITIES.map((severity) => ({ value: severity, label: severity })),
      statuses: [
        { value: "open", label: "Open" },
        { value: "all", label: "All" },
      ],
      zones: incidentZones(),
    };
  }

  async list(query: IncidentListQuery) {
    const parsed = parseIncidentQuery(query);
    const all = await this.incidents.list();
    const incidents = all.filter((incident) => matches(incident, parsed.status)).map(toView);
    return {
      asOf: INCIDENT_AS_OF,
      summary: summarize(all),
      types: INCIDENT_TYPES.map((type) => ({ value: type, label: type })),
      severities: INCIDENT_SEVERITIES.map((severity) => ({ value: severity, label: severity })),
      filters: { status: parsed.status },
      count: incidents.length,
      incidents,
    };
  }

  async getById(id: string) {
    return { incident: toView(await this.require(id)) };
  }

  async create(input: unknown) {
    const existing = await this.incidents.list();
    const parsed = parseCreateIncident(input);
    const data: CreateIncidentData = {
      id: nextCode(existing),
      type: parsed.type,
      severity: parsed.severity,
      riderId: parsed.riderId,
      riderName: parsed.riderName,
      orderId: parsed.orderId,
      zoneId: parsed.zoneId,
      description: parsed.description,
      reportedMin: parsed.reportedMin ?? latestReported(existing),
      status: "open",
      source: "Logged",
    };
    if (existing.some((incident) => incident.id === data.id)) {
      throw new AppError(409, "An incident with this id already exists");
    }
    try {
      const created = await this.incidents.create(data);
      return { incident: toView(created) };
    } catch (err) {
      if (isDuplicateKey(err)) throw new AppError(409, "An incident with this id already exists");
      throw err;
    }
  }

  async update(id: string, input: unknown) {
    await this.require(id);
    const status = parseIncidentStatus(input);
    const updated = await this.incidents.updateStatus(id, status);
    if (!updated) throw new AppError(404, "Incident not found");
    return { incident: toView(updated) };
  }

  private async require(id: string): Promise<IncidentRecord> {
    const incident = await this.incidents.findByCode(id);
    if (!incident) throw new AppError(404, "Incident not found");
    return incident;
  }
}

function matches(incident: IncidentRecord, status: IncidentListStatus): boolean {
  if (status === "all") return true;
  return incident.status === status;
}

function summarize(incidents: IncidentRecord[]) {
  return {
    open: incidents.filter((incident) => incident.status === "open").length,
    highSeverity: incidents.filter((incident) => incident.severity === "High").length,
    resolved: incidents.filter((incident) => incident.status === "resolved").length,
  };
}

function toView(incident: IncidentRecord) {
  return {
    id: incident.id,
    type: incident.type,
    severity: incident.severity,
    rider: incident.riderName || "\u2014",
    riderId: incident.riderId,
    orderId: incident.orderId,
    where: incidentWhere(incident.zoneId),
    zoneId: incident.zoneId,
    description: incident.description,
    reported: incidentReported(incident.reportedMin),
    reportedMin: incident.reportedMin,
    status: incident.status,
    source: incident.source,
  };
}

function nextCode(incidents: IncidentRecord[]): string {
  const max = incidents.reduce((highest, incident) => {
    const match = /^INC-(\d+)$/.exec(incident.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `INC-${String(max + 1).padStart(4, "0")}`;
}

function latestReported(incidents: IncidentRecord[]): number {
  if (incidents.length === 0) return 12 * 60;
  return incidents.reduce((latest, incident) => Math.max(latest, incident.reportedMin), 0);
}

