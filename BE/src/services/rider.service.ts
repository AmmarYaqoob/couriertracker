import {
  ACTIVITIES,
  EMPLOYMENT_TYPES,
  PILOT_DAY,
  PLATFORM_NAMES,
  VEHICLE_NAMES,
  VEHICLE_TYPES,
  ZONES,
  activityLabel,
  clock,
  euro,
  percent,
  zoneById,
  type EmploymentType,
  type PerformanceRecord,
  type RiderRecord,
} from "../domain/rider";
import { DOCUMENT_NAMES, daysUntilExpiry, type DocumentRecord } from "../domain/document";
import type { PayrollLineRecord } from "../domain/payroll";
import {
  assessMiniJob,
  complianceItems,
  complianceScore,
  complianceTone,
  type ComplianceItem,
  type DocumentStatus,
  type MiniJobAssessment,
  type PayrollMonth,
  type RiderComplianceFacts,
  type RiderDocument,
} from "../domain/riderRules";
import { AppError, isDuplicateKey } from "../errors/appError";
import type { DocumentRepository } from "../repositories/document.repository";
import type { PayrollRepository } from "../repositories/payroll.repository";
import type { RiderRepository } from "../repositories/rider.repository";
import { parseCreateRider, parseRiderQuery, parseUpdateRider } from "./riderInput";

interface RiderFacts extends RiderComplianceFacts {
  documents: DocumentRecord[];
  payroll: PayrollLineRecord | null;
}

export interface RiderListQuery {
  employment?: string;
  search?: string;
}

export class RiderService {
  constructor(
    private readonly riders: RiderRepository,
    private readonly documentStore: DocumentRepository,
    private readonly payrollStore: PayrollRepository,
  ) {}

  catalog() {
    return {
      asOf: PILOT_DAY,
      employmentTypes: [
        { value: "all", label: "All" },
        ...EMPLOYMENT_TYPES.map((type) => ({
          value: type,
          label: type === "Working Student" ? "Student" : type,
        })),
      ],
      platforms: Object.entries(PLATFORM_NAMES).map(([id, name]) => ({ id, name })),
      vehicles: VEHICLE_TYPES.map((type) => ({ type, label: VEHICLE_NAMES[type] })),
      zones: ZONES.map((zone) => ({ ...zone })),
      activities: ACTIVITIES.map((activity) => ({ activity, label: activityLabel(activity) })),
      compliance: { goodAt: 90, warnAt: 70 },
      miniJobLimits: { 2026: 603, 2027: 633 },
    };
  }

  async list(query: RiderListQuery) {
    const parsed = parseRiderQuery(query);
    const [all, facts] = await Promise.all([this.riders.list(), this.loadFacts()]);
    const riders = all.filter((rider) => matches(rider, parsed.employment, parsed.search));
    return {
      asOf: PILOT_DAY,
      summary: summarize(all, facts),
      filters: {
        employment: parsed.employment ?? "all",
        search: parsed.search ?? "",
      },
      count: riders.length,
      riders: riders.map((rider) => toListItem(rider, factsFor(facts, rider.id))),
    };
  }

  async getById(id: string) {
    const rider = await this.require(id);
    return { rider: toDetail(rider, factsFor(await this.loadFacts(), rider.id)) };
  }

  async documents(id: string) {
    const rider = await this.require(id);
    const facts = factsFor(await this.loadFacts(), rider.id);
    return { riderId: rider.id, documents: savedDocuments(facts.documents) };
  }

  async payroll(id: string) {
    const rider = await this.require(id);
    const facts = factsFor(await this.loadFacts(), rider.id);
    return { riderId: rider.id, payroll: savedPayroll(facts.payroll), miniJob: miniJobView(rider, facts.earnings) };
  }

  async compliance(id: string) {
    const rider = await this.require(id);
    const facts = factsFor(await this.loadFacts(), rider.id);
    const items = complianceItems(rider, facts);
    const score = complianceScore(items);
    return { riderId: rider.id, score, tone: complianceTone(score), items };
  }

  async performance(id: string) {
    const rider = await this.require(id);
    return { riderId: rider.id, performance: performanceView(rider.performance) };
  }

  async create(input: unknown) {
    const existing = await this.riders.list();
    const data = parseCreateRider(input, nextCode(existing));
    if (existing.some((rider) => rider.id === data.id)) {
      throw new AppError(409, "A rider with this id already exists");
    }
    try {
      const created = await this.riders.create(data);
      return { rider: toDetail(created, factsFor(await this.loadFacts(), created.id)) };
    } catch (err) {
      if (isDuplicateKey(err)) throw new AppError(409, "A rider with this id already exists");
      throw err;
    }
  }

  async update(id: string, input: unknown) {
    const current = await this.require(id);
    const data = parseUpdateRider(input, current);
    try {
      const updated = await this.riders.update(id, data);
      if (!updated) throw new AppError(404, "Rider not found");
      return { rider: toDetail(updated, factsFor(await this.loadFacts(), updated.id)) };
    } catch (err) {
      if (isDuplicateKey(err)) throw new AppError(409, "A rider with this id already exists");
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.riders.delete(id);
    if (!deleted) throw new AppError(404, "Rider not found");
  }

  private async require(id: string): Promise<RiderRecord> {
    const rider = await this.riders.findByCode(id);
    if (!rider) throw new AppError(404, "Rider not found");
    return rider;
  }

  private async loadFacts(): Promise<Map<string, RiderFacts>> {
    const [documents, lines] = await Promise.all([this.documentStore.list(), this.payrollStore.listLines()]);
    const facts = new Map<string, RiderFacts>();
    const ensure = (id: string) => {
      const current = facts.get(id);
      if (current) return current;
      const created: RiderFacts = { permitExpiry: null, earnings: null, documents: [], payroll: null };
      facts.set(id, created);
      return created;
    };

    for (const document of documents) {
      const current = ensure(document.riderId);
      current.documents.push(document);
      if (document.kind === "aufenthaltstitel" || document.kind === "duldung") {
        if (!current.permitExpiry || document.expiresOn < current.permitExpiry) {
          current.permitExpiry = document.expiresOn;
        }
      }
    }

    for (const line of lines) {
      const current = ensure(line.id);
      current.payroll = line;
      current.earnings = line.gross;
    }

    return facts;
  }
}

function matches(rider: RiderRecord, employment?: EmploymentType, search?: string): boolean {
  if (employment && rider.employmentType !== employment) return false;
  if (!search) return true;
  const zone = zoneById(rider.homeZoneId);
  const haystack = `${rider.name} ${rider.id} ${zone.id} ${zone.name}`.toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function factsFor(facts: Map<string, RiderFacts>, id: string): RiderFacts {
  return facts.get(id) ?? { permitExpiry: null, earnings: null, documents: [], payroll: null };
}

function summarize(riders: RiderRecord[], facts: Map<string, RiderFacts>) {
  const count = (type: EmploymentType) => riders.filter((rider) => rider.employmentType === type).length;
  const fullTime = count("Full-time");
  const partTime = count("Part-time");
  const miniJob = count("Mini-job");
  const midiJob = count("Midi-job");
  const workingStudent = count("Working Student");
  return {
    ridersInPilot: riders.length,
    fullTime,
    partTime,
    fullTimePartTimeLabel: `${fullTime} / ${partTime}`,
    miniJob,
    midiJob,
    workingStudent,
    miniMidiStudentLabel: `${miniJob} / ${midiJob} / ${workingStudent}`,
    complianceBelow70: riders.filter(
      (rider) => complianceScore(complianceItems(rider, factsFor(facts, rider.id))) < 70,
    ).length,
  };
}

function toListItem(rider: RiderRecord, facts: RiderFacts) {
  const items = complianceItems(rider, facts);
  const score = complianceScore(items);
  const zone = zoneById(rider.homeZoneId);
  return {
    id: rider.id,
    name: rider.name,
    joined: rider.joined,
    employmentType: rider.employmentType,
    contractType: rider.contractType,
    zone,
    platform: { id: rider.platform, name: PLATFORM_NAMES[rider.platform] },
    vehicle: {
      id: rider.vehicle.id,
      type: rider.vehicle.type,
      typeLabel: VEHICLE_NAMES[rider.vehicle.type],
      label: rider.vehicle.label,
      batteryHealthPct: rider.vehicle.batteryHealthPct,
    },
    shift: {
      startMin: rider.shiftStart,
      endMin: rider.shiftEnd,
      start: clock(rider.shiftStart),
      end: clock(rider.shiftEnd),
      label: `${clock(rider.shiftStart)}–${clock(rider.shiftEnd)}`,
    },
    status: { activity: rider.activity, label: activityLabel(rider.activity) },
    compliance: { score, tone: complianceTone(score) },
  };
}

function toDetail(rider: RiderRecord, facts: RiderFacts) {
  const items = complianceItems(rider, facts);
  const score = complianceScore(items);
  const zone = zoneById(rider.homeZoneId);
  const currentZone = zoneById(rider.currentZoneId);
  return {
    ...toListItem(rider, facts),
    asOf: PILOT_DAY,
    contract: {
      employmentType: rider.employmentType,
      contractType: rider.contractType,
      hoursPerWeek: rider.hoursPerWeek,
      hourlyRate: rider.hourlyRate,
      hourlyRateLabel: euro(rider.hourlyRate),
      joined: rider.joined,
      contractEnd: rider.contractEnd,
      contractEndLabel: rider.contractEnd ?? "Open-ended",
      homeZone: zone,
      platform: { id: rider.platform, name: PLATFORM_NAMES[rider.platform] },
      alnaifCoordinator: rider.alnaifCoordinator,
    },
    today: {
      status: { activity: rider.activity, label: activityLabel(rider.activity) },
      currentZone,
      shift: shiftView(rider),
      break: breakView(rider),
      preShiftCheck: readinessView(rider),
      deliveries: deliveryView(rider),
      vehicle: vehicleView(rider),
    },
    documents: savedDocuments(facts.documents),
    payroll: savedPayroll(facts.payroll),
    miniJob: miniJobView(rider, facts.earnings),
    compliance: { score, tone: complianceTone(score), items },
    performance: performanceView(rider.performance),
    createdAt: rider.createdAt.toISOString(),
    updatedAt: rider.updatedAt.toISOString(),
  };
}

function shiftView(rider: RiderRecord) {
  const window = `${clock(rider.shiftStart)}–${clock(rider.shiftEnd)}`;
  return {
    startMin: rider.shiftStart,
    endMin: rider.shiftEnd,
    start: clock(rider.shiftStart),
    end: clock(rider.shiftEnd),
    lateStartMin: rider.lateStartMin,
    label: rider.lateStartMin ? `${window} (started ${rider.lateStartMin} min late)` : window,
  };
}

function breakView(rider: RiderRecord) {
  const required = rider.shiftEnd - rider.shiftStart > 360;
  return {
    startMin: rider.breakStart,
    minutes: rider.breakMinutes,
    start: rider.breakMinutes ? clock(rider.breakStart) : null,
    required,
    label: rider.breakMinutes
      ? `${clock(rider.breakStart)}, ${rider.breakMinutes} min`
      : "Not required (shift ≤ 6 h)",
  };
}

function readinessView(rider: RiderRecord) {
  const label =
    rider.readinessPassed === false
      ? `Failed: ${rider.readinessIssue ?? "Pre-shift check failed"}`
      : rider.readinessPassed === null
        ? "Not done"
        : "Passed";
  return { passed: rider.readinessPassed, issue: rider.readinessIssue, label };
}

function deliveryView(rider: RiderRecord) {
  return {
    deliveries: rider.deliveriesToday,
    onTime: rider.onTimeToday,
    label: rider.deliveriesToday ? `${rider.deliveriesToday} (${rider.onTimeToday} on time)` : "0",
  };
}

function vehicleView(rider: RiderRecord) {
  const battery = rider.vehicle.batteryHealthPct;
  return {
    ...rider.vehicle,
    typeLabel: VEHICLE_NAMES[rider.vehicle.type],
    display: battery === null ? rider.vehicle.label : `${rider.vehicle.label}, battery ${battery}%`,
  };
}

function savedDocuments(documents: DocumentRecord[]): RiderDocument[] {
  return documents
    .map((document) => {
      const daysLeft = daysUntilExpiry(document.expiresOn);
      const status: DocumentStatus = daysLeft < 0 ? "expired" : daysLeft <= 60 ? "expiring" : "verified";
      return {
        name: DOCUMENT_NAMES[document.kind],
        status,
        detail: `${document.reference} · expires ${document.expiresOn}`,
        daysLeft,
      };
    })
    .sort((left, right) => left.daysLeft - right.daysLeft || left.name.localeCompare(right.name))
    .map(({ daysLeft: _daysLeft, ...document }) => document);
}

function savedPayroll(line: PayrollLineRecord | null): PayrollMonth[] {
  if (!line) return [];
  return [
    {
      month: "Sep 2026",
      hours: line.hours,
      gross: line.gross,
      grossLabel: euro(line.gross),
      status: line.status,
      note: line.note,
    },
  ];
}

function miniJobView(rider: RiderRecord, earnings: number | null): MiniJobAssessment | null {
  if (rider.employmentType !== "Mini-job" || earnings === null) return null;
  const assessed = assessMiniJob(earnings);
  return {
    ...assessed,
    limit2027: 633,
    monthlyEarningsLabel: euro(earnings, 0),
    limitLabel: euro(assessed.limit, 0),
    message: `Mini-job earnings this month: €${earnings} of the €${assessed.limit} limit (2026, annual average). The limit rises to €633 in 2027.`,
  };
}

function performanceView(performance: PerformanceRecord) {
  return {
    ...performance,
    rawPctLabel: percent(performance.rawPct),
    adjustedPctLabel: percent(performance.adjustedPct),
    adjustedRangeLabel:
      performance.adjustedLow === null || performance.adjustedHigh === null
        ? null
        : `${percent(performance.adjustedPct)} (${performance.adjustedLow.toFixed(1)}–${performance.adjustedHigh.toFixed(1)}%)`,
    attendancePctLabel: percent(performance.attendancePct),
    cancellationPctLabel: percent(performance.cancellationPct),
    wrongOrMissingPctLabel: percent(performance.wrongOrMissingPct),
  };
}

function nextCode(riders: RiderRecord[]): string {
  const max = riders.reduce((highest, rider) => {
    const match = /^D(\d+)$/.exec(rider.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `D${String(max + 1).padStart(3, "0")}`;
}

export type { ComplianceItem, PayrollMonth, RiderDocument };
