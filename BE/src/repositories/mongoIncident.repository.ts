import type { Model } from "mongoose";
import type {
  CreateIncidentData,
  IncidentRecord,
  IncidentSeverity,
  IncidentSource,
  IncidentStatus,
  IncidentType,
} from "../domain/incident";
import { isZoneId } from "../domain/rider";
import type { IncidentDocument, IncidentSchema } from "../models/incident.model";
import type { IncidentRepository } from "./incident.repository";

function toRecord(doc: IncidentDocument): IncidentRecord {
  return {
    id: doc.code,
    type: doc.type as IncidentType,
    severity: doc.severity as IncidentSeverity,
    riderId: doc.riderId || null,
    riderName: doc.riderName || null,
    orderId: doc.orderId || null,
    zoneId: doc.zoneId && isZoneId(doc.zoneId) ? doc.zoneId : null,
    description: doc.description,
    reportedMin: doc.reportedMin,
    status: doc.status as IncidentStatus,
    source: doc.source as IncidentSource,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toDoc(data: CreateIncidentData) {
  return {
    code: data.id,
    type: data.type,
    severity: data.severity,
    riderId: data.riderId,
    riderName: data.riderName,
    orderId: data.orderId,
    zoneId: data.zoneId,
    description: data.description,
    reportedMin: data.reportedMin,
    status: data.status,
    source: data.source,
  };
}

export class MongoIncidentRepository implements IncidentRepository {
  constructor(private readonly incidents: Model<IncidentSchema>) {}

  async count(): Promise<number> {
    return this.incidents.countDocuments();
  }

  async insertMany(rows: CreateIncidentData[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.incidents.insertMany(rows.map(toDoc));
    return docs.length;
  }

  async list(): Promise<IncidentRecord[]> {
    const docs = await this.incidents.find().sort({ reportedMin: -1, code: -1 });
    return docs.map(toRecord);
  }

  async findByCode(code: string): Promise<IncidentRecord | null> {
    const doc = await this.incidents.findOne({ code });
    return doc ? toRecord(doc) : null;
  }

  async create(data: CreateIncidentData): Promise<IncidentRecord> {
    const doc = await this.incidents.create(toDoc(data));
    return toRecord(doc);
  }

  async updateStatus(code: string, status: IncidentStatus): Promise<IncidentRecord | null> {
    const doc = await this.incidents.findOneAndUpdate(
      { code },
      { status },
      { new: true, runValidators: true },
    );
    return doc ? toRecord(doc) : null;
  }
}
