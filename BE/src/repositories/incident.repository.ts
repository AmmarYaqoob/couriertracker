import type { CreateIncidentData, IncidentRecord, IncidentStatus } from "../domain/incident";

export interface IncidentRepository {
  count(): Promise<number>;
  insertMany(rows: CreateIncidentData[]): Promise<number>;
  list(): Promise<IncidentRecord[]>;
  findByCode(code: string): Promise<IncidentRecord | null>;
  create(data: CreateIncidentData): Promise<IncidentRecord>;
  updateStatus(code: string, status: IncidentStatus): Promise<IncidentRecord | null>;
}
