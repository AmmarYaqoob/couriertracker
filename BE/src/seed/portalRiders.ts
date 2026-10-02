import {
  PILOT_DAY,
  defaultPerformance,
  type Activity,
  type CreateRiderData,
  type EmploymentType,
  type VehicleType,
  type ZoneId,
} from "../domain/rider";

const FIRST_NAMES = [
  "Jonas", "Lea", "Omar", "Mila", "Nina", "Felix", "Sarah", "Ahmed", "Lukas", "Amira",
  "Tim", "Hannah", "Yusuf", "Elif", "Paul", "Sofia", "Karim", "Julia", "Mehmet", "Anna",
  "David", "Zeynep", "Leon", "Aylin", "Noah", "Marta", "Ravi", "Laura", "Emre", "Priya",
  "Ben", "Chiara", "Samuel", "Ines", "Tariq", "Greta", "Arjun", "Maja", "Kofi", "Lena",
];

const LAST_NAMES = [
  "Krüger", "Hoffmann", "Haddad", "Fischer", "Vogel", "Schmidt", "Weber", "Yilmaz", "Becker", "Nasser",
  "Wagner", "Demir", "Klein", "Kaya", "Wolf", "Rossi", "Mansour", "Braun", "Öztürk", "Richter",
  "Nowak", "Aksoy", "Lang", "Arslan", "Hartmann", "Kowalski", "Patel", "Schulz", "Çelik", "Iyer",
  "Neumann", "Bianchi", "Mensah", "Costa", "Rahimi", "Lindner", "Sharma", "Zielinski", "Owusu", "Keller",
];

const ZONES: ZoneId[] = [
  "innenstadt", "sachsenhausen", "nordend", "bornheim", "bockenheim", "westend", "ostend", "gallus",
];

const STAFF: Record<ZoneId, number[]> = {
  innenstadt: [5, 1, 2, 6, 4],
  sachsenhausen: [3, 1, 1, 3, 3],
  nordend: [4, 1, 2, 5, 3],
  bornheim: [2, 1, 1, 4, 2],
  bockenheim: [3, 1, 1, 4, 2],
  westend: [2, 1, 1, 3, 2],
  ostend: [2, 1, 1, 3, 2],
  gallus: [2, 1, 1, 2, 2],
};

const WINDOWS = [
  { label: "Lunch", start: 660, end: 900 },
  { label: "Day", start: 660, end: 1050 },
  { label: "Late afternoon", start: 900, end: 1200 },
  { label: "Dinner", start: 1050, end: 1320 },
  { label: "Evening", start: 1110, end: 1410 },
];

const EMPLOYMENT: EmploymentType[] = ["Full-time", "Part-time", "Mini-job", "Working Student", "Midi-job"];
const VEHICLES: VehicleType[] = ["e_bike", "bike", "scooter", "car"];
const PLATFORMS = ["uber_eats", "wolt", "lieferando", "uber_eats", "wolt", "uber_eats", "lieferando", "wolt"] as const;

const VEHICLE_LABEL: Record<VehicleType, string> = {
  bike: "Bike",
  e_bike: "E-bike",
  scooter: "E-scooter",
  car: "Car",
};

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 1831565813) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function between(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng();
}

function integer(rng: () => number, min: number, max: number): number {
  return Math.floor(between(rng, min, max + 1));
}

function pick<T>(rng: () => number, values: T[]): T {
  return values[Math.floor(rng() * values.length)];
}

function weighted<T>(rng: () => number, values: T[], weights: number[]): T {
  let cursor = rng() * weights.reduce((sum, weight) => sum + weight, 0);
  for (let index = 0; index < values.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return values[index];
  }
  return values[values.length - 1];
}

function contractType(employmentType: EmploymentType): string {
  if (employmentType === "Full-time") return "Permanent";
  if (employmentType === "Working Student") return "Fixed-term";
  return employmentType;
}

function hoursFor(employmentType: EmploymentType): number {
  if (employmentType === "Full-time") return 40;
  if (employmentType === "Part-time") return 25;
  if (employmentType === "Midi-job") return 30;
  if (employmentType === "Working Student") return 20;
  return 10;
}

interface Draft extends CreateRiderData {
  shiftLabel: string;
}

export function buildPortalRiders(): CreateRiderData[] {
  const rng = random(20260916);
  const drafts: Draft[] = [];
  const platformCursor = [0, 0, 0, 0, 0];
  let count = 0;

  for (const zoneId of ZONES) {
    STAFF[zoneId].forEach((slots, windowIndex) => {
      for (let slot = 0; slot < slots; slot += 1) {
        count += 1;
        const code = `D${String(count).padStart(3, "0")}`;
        const window = WINDOWS[windowIndex];
        const vehicleType = weighted(rng, VEHICLES, [55, 22, 15, 8]);
        const employmentType = weighted(rng, EMPLOYMENT, [30, 30, 15, 15, 10]);
        const length = window.end - window.start;
        const hourlyRate = employmentType === "Mini-job" ? 13.9 : Number(between(rng, 13.9, 15.5).toFixed(2));
        const vehicleId = `V${String(count).padStart(3, "0")}`;
        const joined = pick(rng, ["Jul 2026", "Aug 2026", "Sep 2026", "Jun 2026"]);
        const lateRoll = rng();
        const lateStartMin = lateRoll < 0.12 ? integer(rng, 4, 18) : 0;
        const permitRoll = rng();
        if (permitRoll < 0.3) {
          pick(rng, ["10", "11", "12"]);
          integer(rng, 1, 28);
        } else if (rng() < 0.5) {
          // Keep the same random sequence as the original permit draw.
        }
        const electric = vehicleType === "e_bike" || vehicleType === "scooter";
        between(rng, 0.1, 1.05);
        integer(rng, 3, 95);
        const batteryHealthPct = electric ? integer(rng, 71, 99) : null;
        if (electric) integer(rng, 40, 620);
        if (rng() < 0.2) integer(rng, 20, 180);
        drafts.push({
          id: code,
          name: `${FIRST_NAMES[(count * 7) % FIRST_NAMES.length]} ${LAST_NAMES[(count * 11) % LAST_NAMES.length]}`,
          employmentType,
          contractType: contractType(employmentType),
          hoursPerWeek: hoursFor(employmentType),
          hourlyRate,
          joined,
          contractEnd: employmentType === "Working Student" ? "2027-02-28" : null,
          homeZoneId: zoneId,
          platform: PLATFORMS[platformCursor[windowIndex]++ % PLATFORMS.length],
          vehicle: {
            id: vehicleId,
            type: vehicleType,
            label: `${VEHICLE_LABEL[vehicleType]} ${vehicleId}`,
            batteryHealthPct,
          },
          shiftStart: window.start,
          shiftEnd: window.end,
          breakStart: window.start + Math.round(length / 2 / 15) * 15 - 15,
          breakMinutes: length > 360 ? 30 : 0,
          lateStartMin,
          noShow: false,
          readinessPassed: true,
          readinessIssue: null,
          alnaifCoordinator: window.start < 960 ? "Samir Nasser" : "Dilara Aksoy",
          activity: "off_shift",
          currentZoneId: zoneId,
          deliveriesToday: 0,
          onTimeToday: 0,
          performance: defaultPerformance(),
          shiftLabel: window.label,
        });
      }
    });
  }

  for (const rider of drafts) {
    if (rider.employmentType === "Mini-job") integer(rng, 470, 590);
  }

  drafts[29].hourlyRate = 13.5;

  const inShift = (zoneId: ZoneId, label: string) => drafts.filter((rider) => rider.homeZoneId === zoneId && rider.shiftLabel === label);
  const sachsenhausenDinner = inShift("sachsenhausen", "Dinner");
  if (sachsenhausenDinner[0]) {
    sachsenhausenDinner[0].noShow = true;
    sachsenhausenDinner[0].activity = "no_show";
  }
  const ostendEvening = inShift("ostend", "Evening");
  if (ostendEvening[1]) {
    ostendEvening[1].noShow = true;
    ostendEvening[1].activity = "no_show";
  }
  const blockedBattery = inShift("sachsenhausen", "Evening")[0];
  if (blockedBattery) {
    blockedBattery.readinessPassed = false;
    blockedBattery.readinessIssue = "E-bike battery at 18%, spare battery needed";
    blockedBattery.activity = "blocked";
  }
  const blockedBag = inShift("nordend", "Dinner")[0];
  if (blockedBag) {
    blockedBag.readinessPassed = false;
    blockedBag.readinessIssue = "Delivery bag not clean";
    blockedBag.activity = "blocked";
  }
  const notChecked = inShift("gallus", "Evening")[0];
  if (notChecked) {
    notChecked.readinessPassed = null;
    notChecked.activity = "blocked";
  }

  return drafts.map(({ shiftLabel: _shiftLabel, ...rider }) => rider);
}

export const PORTAL_DAY = PILOT_DAY;
