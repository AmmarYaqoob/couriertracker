import {
  VEHICLE_NAME_PREFIX,
  type CreateStockData,
  type CreateVehicleData,
  type VehicleStatus,
  type VehicleType,
} from "../domain/equipment";

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

const ZONES = [
  "innenstadt", "sachsenhausen", "nordend", "bornheim", "bockenheim", "westend", "ostend", "gallus",
] as const;

type ZoneId = (typeof ZONES)[number];

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

const EMPLOYMENT = ["Full-time", "Part-time", "Mini-job", "Working Student", "Midi-job"] as const;
type EmploymentType = (typeof EMPLOYMENT)[number];
const VEHICLES: VehicleType[] = ["e_bike", "bike", "scooter", "car"];

const POOL: Array<[VehicleType, VehicleStatus]> = [
  ["e_bike", "reserve"],
  ["e_bike", "reserve"],
  ["bike", "reserve"],
  ["scooter", "maintenance"],
  ["car", "reserve"],
  ["e_bike", "defect"],
];

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

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)];
}

function weighted<T>(rng: () => number, values: readonly T[], weights: number[]): T {
  let cursor = rng() * weights.reduce((sum, weight) => sum + weight, 0);
  for (let index = 0; index < values.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return values[index];
  }
  return values[values.length - 1];
}

function hoursFor(employmentType: EmploymentType): number {
  if (employmentType === "Full-time") return 40;
  if (employmentType === "Part-time") return 25;
  if (employmentType === "Midi-job") return 30;
  if (employmentType === "Working Student") return 20;
  return 10;
}

interface Draft {
  id: string;
  employmentType: EmploymentType;
  hoursPerWeek: number;
  hourlyRate: number;
  monthlyEarnings: number;
  homeZoneId: ZoneId;
  shiftLabel: string;
}

export function buildPortalFleet(): { vehicles: CreateVehicleData[]; stock: CreateStockData[] } {
  const rng = random(20260916);
  const drafts: Draft[] = [];
  const vehicles: CreateVehicleData[] = [];

  for (const zoneId of ZONES) {
    STAFF[zoneId].forEach((slots, windowIndex) => {
      for (let slot = 0; slot < slots; slot += 1) {
        const count = drafts.length + 1;
        const code = `D${String(count).padStart(3, "0")}`;
        const window = WINDOWS[windowIndex];
        const vehicleType = weighted(rng, VEHICLES, [55, 22, 15, 8]);
        const employmentType = weighted(rng, EMPLOYMENT, [30, 30, 15, 15, 10]);
        const hourlyRate = employmentType === "Mini-job" ? 13.9 : Number(between(rng, 13.9, 15.5).toFixed(2));
        const vehicleId = `V${String(count).padStart(3, "0")}`;
        pick(rng, ["Jul 2026", "Aug 2026", "Sep 2026", "Jun 2026"]);
        const lateRoll = rng();
        if (lateRoll < 0.12) integer(rng, 4, 18);
        const permitRoll = rng();
        if (permitRoll < 0.3) {
          pick(rng, ["10", "11", "12"]);
          integer(rng, 1, 28);
        } else if (rng() < 0.5) {
          // 2028-03-31 branch consumes one extra roll, matching the portal generator.
        }
        const electric = vehicleType === "e_bike" || vehicleType === "scooter";
        const serviceIntervalKm = vehicleType === "car" ? 15000 : vehicleType === "bike" ? 1500 : 2000;
        const serviceIntervalDays = vehicleType === "car" ? 365 : 90;
        const kmSinceService = Math.round(between(rng, 0.1, 1.05) * serviceIntervalKm);
        const daysSinceService = integer(rng, 3, 95);
        const batteryHealthPct = electric ? integer(rng, 71, 99) : null;
        const batteryCycles = electric ? integer(rng, 40, 620) : null;
        const downtimeMinutes7d = rng() < 0.2 ? integer(rng, 20, 180) : 0;
        drafts.push({
          id: code,
          employmentType,
          hoursPerWeek: hoursFor(employmentType),
          hourlyRate,
          monthlyEarnings: 0,
          homeZoneId: zoneId,
          shiftLabel: window.label,
        });
        vehicles.push({
          id: vehicleId,
          sequence: vehicles.length + 1,
          type: vehicleType,
          label: `${VEHICLE_NAME_PREFIX[vehicleType]} ${vehicleId}`,
          status: "in_service",
          kmSinceService,
          serviceIntervalKm,
          daysSinceService,
          serviceIntervalDays,
          batteryHealthPct,
          batteryCycles,
          assignedDriverId: code,
          assignedDriverName: `${FIRST_NAMES[(count * 7) % FIRST_NAMES.length]} ${LAST_NAMES[(count * 11) % LAST_NAMES.length]}`,
          downtimeMinutes7d,
          openDefects: [],
        });
      }
    });
  }

  for (const rider of drafts) {
    const monthHours = rider.hoursPerWeek * 4.33;
    rider.monthlyEarnings = Math.round(monthHours * rider.hourlyRate);
    if (rider.employmentType === "Mini-job") {
      rider.monthlyEarnings = Math.min(rider.monthlyEarnings, integer(rng, 470, 590));
    }
  }

  for (const [type, status] of POOL) {
    const id = `R${String(vehicles.length - drafts.length + 1).padStart(2, "0")}`;
    const electric = type === "e_bike" || type === "scooter";
    vehicles.push({
      id,
      sequence: vehicles.length + 1,
      type,
      label: `Reserve ${VEHICLE_NAME_PREFIX[type]} ${id}`,
      status,
      kmSinceService: integer(rng, 50, 900),
      serviceIntervalKm: type === "car" ? 15000 : 2000,
      daysSinceService: integer(rng, 5, 60),
      serviceIntervalDays: type === "car" ? 365 : 90,
      batteryHealthPct: electric ? integer(rng, 80, 97) : null,
      batteryCycles: electric ? integer(rng, 30, 300) : null,
      assignedDriverId: null,
      assignedDriverName: null,
      downtimeMinutes7d: status === "defect" ? 1440 : 0,
      openDefects:
        status === "defect" ? ["Rear brake pads worn"] : status === "maintenance" ? ["Scheduled service"] : [],
    });
  }

  const blockedBattery = drafts.find((rider) => rider.homeZoneId === "sachsenhausen" && rider.shiftLabel === "Evening");
  const blockedVehicle = vehicles.find((vehicle) => vehicle.assignedDriverId === blockedBattery?.id);
  blockedVehicle?.openDefects.push("Battery below 20% at shift start");

  return { vehicles, stock: PORTAL_STOCK.map((item, index) => ({ ...item, sequence: index + 1 })) };
}

const PORTAL_STOCK: Array<Omit<CreateStockData, "sequence">> = [
  { item: "Insulated delivery bags", inUse: 91, spare: 14, reorderAt: 10 },
  { item: "Secure carriers and bottle holders", inUse: 62, spare: 9, reorderAt: 8 },
  { item: "Helmets", inUse: 91, spare: 6, reorderAt: 8 },
  { item: "Reflective jackets", inUse: 91, spare: 12, reorderAt: 10 },
  { item: "Rain gear sets", inUse: 88, spare: 4, reorderAt: 10 },
  { item: "Gloves (seasonal)", inUse: 40, spare: 30, reorderAt: 15 },
  { item: "Phone mounts", inUse: 91, spare: 11, reorderAt: 8 },
  { item: "Power banks", inUse: 85, spare: 3, reorderAt: 10 },
  { item: "Spare e-bike batteries", inUse: 0, spare: 5, reorderAt: 6 },
  { item: "Cleaning kits", inUse: 91, spare: 25, reorderAt: 20 },
];
