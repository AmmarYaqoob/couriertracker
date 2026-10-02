import type { IncidentRepository } from "../repositories/incident.repository";
import { buildPortalIncidents } from "./portalIncidents";

export async function seedDemoIncidents(incidents: IncidentRepository): Promise<number> {
  if ((await incidents.count()) > 0) return 0;
  return incidents.insertMany(buildPortalIncidents());
}
