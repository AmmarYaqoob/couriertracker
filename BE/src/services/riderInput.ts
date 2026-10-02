import { AppError } from "../errors/appError";
import {
  ACTIVITIES,
  ALNAIF_DAY,
  ALNAIF_EVENING,
  EMPLOYMENT_TYPES,
  HOURS_PER_WEEK,
  PLATFORMS,
  VEHICLE_NAMES,
  VEHICLE_TYPES,
  ZONES,
  defaultContractType,
  defaultPerformance,
  isActivity,
  isEmploymentType,
  isOutcome,
  isPlatform,
  isVehicleType,
  isZoneId,
  type Activity,
  type CreateRiderData,
  type EmploymentType,
  type PerformanceFlag,
  type PerformanceRecord,
  type Platform,
  type RiderRecord,
  type VehicleType,
  type ZoneId,
} from "../domain/rider";

const CODE_PATTERN = /^D\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseCreateRider(input: unknown, nextCode: string): CreateRiderData {
  const body = asRecord(input);
  const employmentType = readEmployment(body.employmentType);
  const homeZoneId = readZone(body.homeZoneId, "Home zone");
  const platform = readPlatform(body.platform);
  const shiftStart = readMinutes(required(body, "shiftStart"), "Shift start");
  const shiftEnd = readMinutes(required(body, "shiftEnd"), "Shift end");
  assertShift(shiftStart, shiftEnd);

  const id = body.id === undefined ? nextCode : readCode(body.id);
  const vehicle = readVehicle(body.vehicle, id, true);
  const hoursPerWeek = body.hoursPerWeek === undefined ? HOURS_PER_WEEK[employmentType] : readPositive(body.hoursPerWeek, "Hours per week");
  const hourlyRate = body.hourlyRate === undefined ? (employmentType === "Mini-job" ? 13.9 : 14.5) : readPositive(body.hourlyRate, "Hourly rate");
  const breakMinutes =
    body.breakMinutes === undefined ? (shiftEnd - shiftStart > 360 ? 30 : 0) : readNonNegative(body.breakMinutes, "Break minutes");
  const breakStart =
    body.breakStart === undefined ? defaultBreakStart(shiftStart, shiftEnd) : readMinutes(body.breakStart, "Break start");

  const data: CreateRiderData = {
    id,
    name: readName(body.name),
    employmentType,
    contractType:
      body.contractType === undefined ? defaultContractType(employmentType) : readText(body.contractType, "Contract type", 40),
    hoursPerWeek,
    hourlyRate,
    joined: body.joined === undefined ? "Sep 2026" : readText(body.joined, "Joined", 40),
    contractEnd: body.contractEnd === undefined ? null : readDate(body.contractEnd, "Contract end"),
    homeZoneId,
    platform,
    vehicle,
    shiftStart,
    shiftEnd,
    breakStart,
    breakMinutes,
    lateStartMin: body.lateStartMin === undefined ? 0 : readNonNegative(body.lateStartMin, "Late start"),
    noShow: false,
    readinessPassed: body.readinessPassed === undefined ? true : readNullableBoolean(body.readinessPassed, "Readiness"),
    readinessIssue: body.readinessIssue === undefined ? null : readNullableText(body.readinessIssue, "Readiness issue", 160),
    alnaifCoordinator:
      body.alnaifCoordinator === undefined
        ? shiftStart < 960
          ? ALNAIF_DAY
          : ALNAIF_EVENING
        : readText(body.alnaifCoordinator, "Alnaif coordinator", 80),
    activity: body.activity === undefined ? "off_shift" : readActivity(body.activity),
    currentZoneId: body.currentZoneId === undefined ? homeZoneId : readZone(body.currentZoneId, "Current zone"),
    deliveriesToday: body.deliveriesToday === undefined ? 0 : readNonNegative(body.deliveriesToday, "Deliveries today"),
    onTimeToday: body.onTimeToday === undefined ? 0 : readNonNegative(body.onTimeToday, "On-time deliveries"),
    performance: body.performance === undefined ? defaultPerformance() : readPerformance(body.performance),
  };
  assertDeliveries(data.deliveriesToday, data.onTimeToday);
  return data;
}

export function parseUpdateRider(input: unknown, current: RiderRecord): CreateRiderData {
  const body = asRecord(input);
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...currentData } = current;
  const next: CreateRiderData = {
    ...currentData,
    vehicle: { ...current.vehicle },
    performance: {
      ...current.performance,
      flags: current.performance.flags.map((flag) => ({ ...flag })),
    },
  };
  let changed = false;

  const set = (key: string, apply: () => void) => {
    if (body[key] !== undefined) {
      changed = true;
      apply();
    }
  };

  set("name", () => {
    next.name = readName(body.name);
  });
  set("employmentType", () => {
    next.employmentType = readEmployment(body.employmentType);
  });
  set("contractType", () => {
    next.contractType = readText(body.contractType, "Contract type", 40);
  });
  set("hoursPerWeek", () => {
    next.hoursPerWeek = readPositive(body.hoursPerWeek, "Hours per week");
  });
  set("hourlyRate", () => {
    next.hourlyRate = readPositive(body.hourlyRate, "Hourly rate");
  });
  set("joined", () => {
    next.joined = readText(body.joined, "Joined", 40);
  });
  set("contractEnd", () => {
    next.contractEnd = readDate(body.contractEnd, "Contract end");
  });
  set("homeZoneId", () => {
    next.homeZoneId = readZone(body.homeZoneId, "Home zone");
  });
  set("platform", () => {
    next.platform = readPlatform(body.platform);
  });
  set("vehicle", () => {
    next.vehicle = readVehicle(body.vehicle, current.id, false, current);
  });
  set("shiftStart", () => {
    next.shiftStart = readMinutes(body.shiftStart, "Shift start");
  });
  set("shiftEnd", () => {
    next.shiftEnd = readMinutes(body.shiftEnd, "Shift end");
  });
  set("breakStart", () => {
    next.breakStart = readMinutes(body.breakStart, "Break start");
  });
  set("breakMinutes", () => {
    next.breakMinutes = readNonNegative(body.breakMinutes, "Break minutes");
  });
  set("lateStartMin", () => {
    next.lateStartMin = readNonNegative(body.lateStartMin, "Late start");
  });
  set("readinessPassed", () => {
    next.readinessPassed = readNullableBoolean(body.readinessPassed, "Readiness");
  });
  set("readinessIssue", () => {
    next.readinessIssue = readNullableText(body.readinessIssue, "Readiness issue", 160);
  });
  set("alnaifCoordinator", () => {
    next.alnaifCoordinator = readText(body.alnaifCoordinator, "Alnaif coordinator", 80);
  });
  set("activity", () => {
    next.activity = readActivity(body.activity);
  });
  set("currentZoneId", () => {
    next.currentZoneId = readZone(body.currentZoneId, "Current zone");
  });
  set("deliveriesToday", () => {
    next.deliveriesToday = readNonNegative(body.deliveriesToday, "Deliveries today");
  });
  set("onTimeToday", () => {
    next.onTimeToday = readNonNegative(body.onTimeToday, "On-time deliveries");
  });
  set("performance", () => {
    next.performance = readPerformance(body.performance);
  });

  if (!changed) throw new AppError(400, "No changes were provided");
  assertShift(next.shiftStart, next.shiftEnd);
  assertDeliveries(next.deliveriesToday, next.onTimeToday);
  return next;
}

export function parseRiderQuery(query: { employment?: string; search?: string }): {
  employment?: EmploymentType;
  search?: string;
} {
  const parsed: { employment?: EmploymentType; search?: string } = {};
  if (query.employment !== undefined && query.employment.toLowerCase() !== "all") {
    parsed.employment = readEmploymentQuery(query.employment);
  }
  if (query.search !== undefined) {
    if (query.search.length > 80) throw new AppError(400, "Search must be 80 characters or fewer");
    parsed.search = query.search;
  }
  return parsed;
}

function readVehicle(
  value: unknown,
  riderId: string,
  creating: boolean,
  current?: RiderRecord,
): CreateRiderData["vehicle"] {
  if (creating && (value === undefined || value === null)) {
    throw new AppError(400, "Vehicle is required");
  }
  const body = asRecord(value);
  const type = body.type === undefined && current ? current.vehicle.type : readVehicleType(body.type);
  const number = riderId.replace(/^D/, "");
  const id = body.id === undefined ? (current?.vehicle.id ?? `V${number}`) : readText(body.id, "Vehicle id", 20);
  const label =
    body.label === undefined
      ? (current && body.type === undefined ? current.vehicle.label : `${VEHICLE_NAMES[type]} ${id}`)
      : readText(body.label, "Vehicle label", 80);
  const battery =
    body.batteryHealthPct === undefined
      ? current && body.type === undefined
        ? current.vehicle.batteryHealthPct
        : type === "e_bike" || type === "scooter"
          ? 90
          : null
      : readBattery(body.batteryHealthPct);
  if (!creating && body.type === undefined && body.id === undefined && body.label === undefined && body.batteryHealthPct === undefined) {
    throw new AppError(400, "Vehicle needs a type, id, label, or battery");
  }
  return { id, type, label, batteryHealthPct: battery };
}

function readPerformance(value: unknown): PerformanceRecord {
  const body = asRecord(value);
  const flags = body.flags === undefined ? [] : readFlags(body.flags);
  const deliveries = readNonNegative(required(body, "deliveries"), "Deliveries");
  return {
    deliveries,
    rawPct: readNullableNumber(body.rawPct, "Raw PTOD", 0, 100),
    adjustedPct: readNullableNumber(body.adjustedPct, "Adjusted PTOD", 0, 100),
    adjustedLow: readNullableNumber(body.adjustedLow, "Adjusted low", 0, 100),
    adjustedHigh: readNullableNumber(body.adjustedHigh, "Adjusted high", 0, 100),
    controllableLate: readNonNegative(required(body, "controllableLate"), "Controllable late"),
    excludedLate: readNonNegative(required(body, "excludedLate"), "Excluded late"),
    attendancePct: readNullableNumber(body.attendancePct, "Attendance", 0, 100),
    cancellationPct: readNullableNumber(body.cancellationPct, "Cancellation", 0, 100),
    wrongOrMissingPct: readNullableNumber(body.wrongOrMissingPct, "Wrong or missing", 0, 100),
    sufficient: readBoolean(required(body, "sufficient"), "Sufficient"),
    outcome: readOutcome(required(body, "outcome")),
    explanation: readText(required(body, "explanation"), "Explanation", 500),
    flags,
  };
}

function readFlags(value: unknown): PerformanceFlag[] {
  if (!Array.isArray(value)) throw new AppError(400, "Flags must be a list");
  return value.map((item) => {
    const flag = asRecord(item);
    return {
      orderId: readText(flag.orderId, "Flag order id", 40),
      kind: readText(flag.kind, "Flag kind", 80),
      detail: readText(flag.detail, "Flag detail", 240),
    };
  });
}

function asRecord(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AppError(400, "Request body must be an object");
  }
  return input as Record<string, unknown>;
}

function required(body: Record<string, unknown>, key: string): unknown {
  if (body[key] === undefined) throw new AppError(400, `${label(key)} is required`);
  return body[key];
}

function readName(value: unknown): string {
  return readText(value, "Name", 80);
}

function readText(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new AppError(400, `${field} is required`);
  const text = value.trim();
  if (text.length > max) throw new AppError(400, `${field} must be ${max} characters or fewer`);
  return text;
}

function readNullableText(value: unknown, field: string, max: number): string | null {
  if (value === null) return null;
  return readText(value, field, max);
}

function readCode(value: unknown): string {
  const code = readText(value, "Rider id", 12);
  if (!CODE_PATTERN.test(code)) throw new AppError(400, "Rider id must look like D001");
  return code;
}

function readEmployment(value: unknown): EmploymentType {
  if (typeof value !== "string" || !isEmploymentType(value)) {
    throw new AppError(400, `Employment type must be one of: ${EMPLOYMENT_TYPES.join(", ")}`);
  }
  return value;
}

function readEmploymentQuery(value: string): EmploymentType {
  const normalized = value.trim().toLowerCase();
  if (normalized === "student" || normalized === "working student") return "Working Student";
  const match = EMPLOYMENT_TYPES.find((type) => type.toLowerCase() === normalized);
  if (!match) throw new AppError(400, `Employment type must be one of: ${EMPLOYMENT_TYPES.join(", ")}`);
  return match;
}

function readPlatform(value: unknown): Platform {
  if (typeof value !== "string" || !isPlatform(value)) {
    throw new AppError(400, `Platform must be one of: ${PLATFORMS.join(", ")}`);
  }
  return value;
}

function readVehicleType(value: unknown): VehicleType {
  if (typeof value !== "string" || !isVehicleType(value)) {
    throw new AppError(400, `Vehicle type must be one of: ${VEHICLE_TYPES.join(", ")}`);
  }
  return value;
}

function readZone(value: unknown, field: string): ZoneId {
  if (typeof value !== "string" || !isZoneId(value)) {
    throw new AppError(400, `${field} must be one of: ${ZONES.map((zone) => zone.id).join(", ")}`);
  }
  return value;
}

function readActivity(value: unknown): Activity {
  if (typeof value !== "string" || !isActivity(value)) {
    throw new AppError(400, `Activity must be one of: ${ACTIVITIES.join(", ")}`);
  }
  return value;
}

function readOutcome(value: unknown): PerformanceRecord["outcome"] {
  if (typeof value !== "string" || !isOutcome(value)) {
    throw new AppError(400, "Performance outcome is not valid");
  }
  return value;
}

function readMinutes(value: unknown, field: string): number {
  const minutes = readNumber(value, field);
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 24 * 60) {
    throw new AppError(400, `${field} must be whole minutes from 0 to 1440`);
  }
  return minutes;
}

function readPositive(value: unknown, field: string): number {
  const number = readNumber(value, field);
  if (number <= 0) throw new AppError(400, `${field} must be greater than 0`);
  return number;
}

function readNonNegative(value: unknown, field: string): number {
  const number = readNumber(value, field);
  if (number < 0) throw new AppError(400, `${field} cannot be negative`);
  return number;
}

function readNullableNumber(value: unknown, field: string, min: number, max: number): number | null {
  if (value === undefined || value === null) return null;
  const number = readNumber(value, field);
  if (number < min || number > max) throw new AppError(400, `${field} must be between ${min} and ${max}`);
  return number;
}

function readBattery(value: unknown): number | null {
  if (value === null) return null;
  const number = readNumber(value, "Battery");
  if (number < 0 || number > 100) throw new AppError(400, "Battery must be between 0 and 100");
  return number;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new AppError(400, `${field} must be a number`);
  return value;
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new AppError(400, `${field} must be true or false`);
  return value;
}

function readNullableBoolean(value: unknown, field: string): boolean | null {
  if (value === null) return null;
  return readBoolean(value, field);
}

function readDate(value: unknown, field: string): string | null {
  if (value === null) return null;
  if (typeof value !== "string" || !DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new AppError(400, `${field} must be a date like 2026-09-16`);
  }
  return value;
}

function assertShift(start: number, end: number): void {
  if (end <= start) throw new AppError(400, "Shift end must be after shift start");
}

function assertDeliveries(deliveries: number, onTime: number): void {
  if (onTime > deliveries) throw new AppError(400, "On-time deliveries cannot exceed deliveries today");
}

function defaultBreakStart(start: number, end: number): number {
  const length = end - start;
  return start + Math.round(length / 2 / 15) * 15 - 15;
}

function label(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`).replace(/^./, (letter) => letter.toUpperCase());
}
