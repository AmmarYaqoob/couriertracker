import type { Model } from "mongoose";
import type {
  Activity,
  CreateRiderData,
  EmploymentType,
  PerformanceOutcome,
  PerformanceRecord,
  Platform,
  RiderRecord,
  VehicleType,
  ZoneId,
} from "../domain/rider";
import { PILOT_DAY } from "../domain/rider";
import type { RiderDocument, RiderSchema } from "../models/rider.model";
import type { RiderRepository } from "./rider.repository";

type ReadinessStatus = "passed" | "failed" | "not_done";

function readinessStatus(passed: boolean | null): ReadinessStatus {
  if (passed === true) return "passed";
  if (passed === false) return "failed";
  return "not_done";
}

function readinessPassed(status: string): boolean | null {
  if (status === "passed") return true;
  if (status === "failed") return false;
  return null;
}

function toPerformance(value: RiderDocument["performance"]): PerformanceRecord {
  return {
    deliveries: value.deliveries,
    rawPct: value.rawPct ?? null,
    adjustedPct: value.adjustedPct ?? null,
    adjustedLow: value.adjustedLow ?? null,
    adjustedHigh: value.adjustedHigh ?? null,
    controllableLate: value.controllableLate,
    excludedLate: value.excludedLate,
    attendancePct: value.attendancePct ?? null,
    cancellationPct: value.cancellationPct ?? null,
    wrongOrMissingPct: value.wrongOrMissingPct ?? null,
    sufficient: value.sufficient,
    outcome: value.outcome as PerformanceOutcome,
    explanation: value.explanation,
    flags: value.flags.map((flag) => ({
      orderId: flag.orderId,
      kind: flag.kind,
      detail: flag.detail,
    })),
  };
}

function toRecord(doc: RiderDocument): RiderRecord {
  const vehicle = doc.vehicle;
  const shift = doc.shift;
  const readiness = doc.readiness;
  const status = doc.status;
  if (!vehicle || !shift || !readiness || !status) {
    throw new Error(`Rider ${doc.code} is missing a required section`);
  }
  return {
    id: doc.code,
    name: doc.name,
    employmentType: doc.employmentType as EmploymentType,
    contractType: doc.contractType,
    hoursPerWeek: doc.hoursPerWeek,
    hourlyRate: doc.hourlyRate,
    joined: doc.joined,
    contractEnd: doc.contractEnd ?? null,
    homeZoneId: doc.homeZoneId as ZoneId,
    platform: doc.platform as Platform,
    vehicle: {
      id: vehicle.id,
      type: vehicle.type as VehicleType,
      label: vehicle.label,
      batteryHealthPct: vehicle.batteryHealthPct ?? null,
    },
    shiftStart: shift.start,
    shiftEnd: shift.end,
    breakStart: shift.breakStart,
    breakMinutes: shift.breakMinutes,
    lateStartMin: shift.lateStartMin,
    noShow: doc.noShow,
    readinessPassed: readinessPassed(readiness.status),
    readinessIssue: readiness.issue ?? null,
    alnaifCoordinator: doc.alnaifCoordinator,
    activity: status.activity as Activity,
    currentZoneId: status.zoneId as ZoneId,
    deliveriesToday: status.deliveries,
    onTimeToday: status.onTime,
    performance: toPerformance(doc.performance),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toDoc(data: CreateRiderData) {
  return {
    code: data.id,
    name: data.name,
    employmentType: data.employmentType,
    contractType: data.contractType,
    hoursPerWeek: data.hoursPerWeek,
    hourlyRate: data.hourlyRate,
    joined: data.joined,
    contractEnd: data.contractEnd,
    homeZoneId: data.homeZoneId,
    platform: data.platform,
    vehicle: {
      id: data.vehicle.id,
      type: data.vehicle.type,
      label: data.vehicle.label,
      batteryHealthPct: data.vehicle.batteryHealthPct,
    },
    shift: {
      date: PILOT_DAY,
      start: data.shiftStart,
      end: data.shiftEnd,
      breakStart: data.breakStart,
      breakMinutes: data.breakMinutes,
      lateStartMin: data.lateStartMin,
    },
    readiness: {
      status: readinessStatus(data.readinessPassed),
      issue: data.readinessIssue,
    },
    alnaifCoordinator: data.alnaifCoordinator,
    noShow: data.noShow,
    status: {
      activity: data.activity,
      zoneId: data.currentZoneId,
      deliveries: data.deliveriesToday,
      onTime: data.onTimeToday,
    },
    performance: data.performance,
  };
}

export class MongoRiderRepository implements RiderRepository {
  constructor(private readonly model: Model<RiderSchema>) {}

  async create(data: CreateRiderData): Promise<RiderRecord> {
    const doc = await this.model.create(toDoc(data));
    return toRecord(doc);
  }

  async findByCode(code: string): Promise<RiderRecord | null> {
    const doc = await this.model.findOne({ code });
    return doc ? toRecord(doc) : null;
  }

  async list(): Promise<RiderRecord[]> {
    const docs = await this.model.find().sort({ code: 1 });
    return docs.map(toRecord);
  }

  async update(code: string, data: CreateRiderData): Promise<RiderRecord | null> {
    const doc = await this.model.findOneAndUpdate({ code }, toDoc(data), {
      new: true,
      runValidators: true,
    });
    return doc ? toRecord(doc) : null;
  }

  async delete(code: string): Promise<boolean> {
    const doc = await this.model.findOneAndDelete({ code });
    return doc !== null;
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }

  async clearCopiedPayAndPermit(): Promise<void> {
    await this.model.collection.updateMany({}, { $unset: { workPermitExpiry: "", monthlyEarnings: "" } });
  }
}
