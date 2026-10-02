export const PILOT_DAY = "2026-09-16";

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Mini-job",
  "Midi-job",
  "Working Student",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const PLATFORMS = ["uber_eats", "wolt", "lieferando"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_NAMES: Record<Platform, string> = {
  uber_eats: "Uber Eats",
  wolt: "Wolt",
  lieferando: "Lieferando",
};

export const VEHICLE_TYPES = ["bike", "e_bike", "scooter", "car"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_NAMES: Record<VehicleType, string> = {
  bike: "Bicycle",
  e_bike: "E-bike",
  scooter: "E-scooter",
  car: "Car",
};

export const ACTIVITIES = [
  "off_shift",
  "no_show",
  "not_started",
  "blocked",
  "on_break",
  "on_delivery",
  "free",
] as const;

export type Activity = (typeof ACTIVITIES)[number];

export const ZONES = [
  { id: "innenstadt", name: "Innenstadt", city: "Frankfurt" },
  { id: "sachsenhausen", name: "Sachsenhausen", city: "Frankfurt" },
  { id: "nordend", name: "Nordend", city: "Frankfurt" },
  { id: "bornheim", name: "Bornheim", city: "Frankfurt" },
  { id: "bockenheim", name: "Bockenheim", city: "Frankfurt" },
  { id: "westend", name: "Westend", city: "Frankfurt" },
  { id: "ostend", name: "Ostend", city: "Frankfurt" },
  { id: "gallus", name: "Gallus", city: "Frankfurt" },
] as const;

export type ZoneId = (typeof ZONES)[number]["id"];

export const PERFORMANCE_OUTCOMES = [
  "no_action",
  "insufficient_data",
  "coaching_conversation",
  "recognise",
] as const;

export type PerformanceOutcome = (typeof PERFORMANCE_OUTCOMES)[number];

export const COMPLIANCE_GOOD_AT = 90;
export const COMPLIANCE_WARN_AT = 70;
export const MINIJOB_WARNING_SHARE = 0.9;
export const ASSESSMENT_MIN_DELIVERIES = 50;

export const WAGE_BANDS = [
  { from: "2025-01-01", rate: 12.82 },
  { from: "2026-01-01", rate: 13.9 },
  { from: "2027-01-01", rate: 14.6 },
] as const;

export const MINIJOB_LIMITS: Record<number, number> = {
  2025: 556,
  2026: 603,
  2027: 633,
};

export const HOURS_PER_WEEK: Record<EmploymentType, number> = {
  "Full-time": 40,
  "Part-time": 25,
  "Mini-job": 10,
  "Midi-job": 30,
  "Working Student": 20,
};

export const ALNAIF_DAY = "Samir Nasser";
export const ALNAIF_EVENING = "Dilara Aksoy";

export interface ZoneRef {
  id: ZoneId;
  name: string;
  city: string;
}

export interface VehicleRecord {
  id: string;
  type: VehicleType;
  label: string;
  batteryHealthPct: number | null;
}

export interface PerformanceFlag {
  orderId: string;
  kind: string;
  detail: string;
}

export interface PerformanceRecord {
  deliveries: number;
  rawPct: number | null;
  adjustedPct: number | null;
  adjustedLow: number | null;
  adjustedHigh: number | null;
  controllableLate: number;
  excludedLate: number;
  attendancePct: number | null;
  cancellationPct: number | null;
  wrongOrMissingPct: number | null;
  sufficient: boolean;
  outcome: PerformanceOutcome;
  explanation: string;
  flags: PerformanceFlag[];
}

export interface RiderRecord {
  id: string;
  name: string;
  employmentType: EmploymentType;
  contractType: string;
  hoursPerWeek: number;
  hourlyRate: number;
  joined: string;
  contractEnd: string | null;
  homeZoneId: ZoneId;
  platform: Platform;
  vehicle: VehicleRecord;
  shiftStart: number;
  shiftEnd: number;
  breakStart: number;
  breakMinutes: number;
  lateStartMin: number;
  noShow: boolean;
  readinessPassed: boolean | null;
  readinessIssue: string | null;
  alnaifCoordinator: string;
  activity: Activity;
  currentZoneId: ZoneId;
  deliveriesToday: number;
  onTimeToday: number;
  performance: PerformanceRecord;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRiderData = Omit<RiderRecord, "createdAt" | "updatedAt">;

export function isEmploymentType(value: string): value is EmploymentType {
  return (EMPLOYMENT_TYPES as readonly string[]).includes(value);
}

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function isVehicleType(value: string): value is VehicleType {
  return (VEHICLE_TYPES as readonly string[]).includes(value);
}

export function isActivity(value: string): value is Activity {
  return (ACTIVITIES as readonly string[]).includes(value);
}

export function isZoneId(value: string): value is ZoneId {
  return ZONES.some((zone) => zone.id === value);
}

export function isOutcome(value: string): value is PerformanceOutcome {
  return (PERFORMANCE_OUTCOMES as readonly string[]).includes(value);
}

export function zoneById(id: ZoneId): ZoneRef {
  const zone = ZONES.find((item) => item.id === id);
  if (!zone) return { id, name: id, city: "Frankfurt" };
  return { id: zone.id, name: zone.name, city: zone.city };
}

export function clock(minutes: number): string {
  const rounded = Math.round(minutes);
  const hour = Math.floor(rounded / 60) % 24;
  const minute = ((rounded % 60) + 60) % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function activityLabel(activity: Activity): string {
  return activity.replaceAll("_", " ");
}

export function euro(amount: number, digits = 2): string {
  const negative = amount < 0 && Math.abs(amount) >= 0.5 * 10 ** -digits;
  const formatted = Math.abs(amount).toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${negative ? "−" : ""}€${formatted}`;
}

export function percent(value: number | null, digits = 1): string | null {
  if (value === null || !Number.isFinite(value)) return null;
  return `${value.toFixed(digits)}%`;
}

export function defaultContractType(employmentType: EmploymentType): string {
  if (employmentType === "Full-time") return "Permanent";
  if (employmentType === "Working Student") return "Fixed-term";
  return employmentType;
}

export function defaultPerformance(): PerformanceRecord {
  return {
    deliveries: 0,
    rawPct: null,
    adjustedPct: null,
    adjustedLow: null,
    adjustedHigh: null,
    controllableLate: 0,
    excludedLate: 0,
    attendancePct: null,
    cancellationPct: null,
    wrongOrMissingPct: null,
    sufficient: false,
    outcome: "insufficient_data",
    explanation: `Only 0 deliveries in 28 days; at least ${ASSESSMENT_MIN_DELIVERIES} are needed before any assessment.`,
    flags: [],
  };
}
