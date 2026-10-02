import { DOCUMENT_AS_OF, type CreateDocument, type DocumentKind } from "../domain/document";

const FIRST_NAMES = [
  "Jonas",
  "Lea",
  "Omar",
  "Mila",
  "Nina",
  "Felix",
  "Sarah",
  "Ahmed",
  "Lukas",
  "Amira",
  "Tim",
  "Hannah",
  "Yusuf",
  "Elif",
  "Paul",
  "Sofia",
  "Karim",
  "Julia",
  "Mehmet",
  "Anna",
  "David",
  "Zeynep",
  "Leon",
  "Aylin",
  "Noah",
  "Marta",
  "Ravi",
  "Laura",
  "Emre",
  "Priya",
  "Ben",
  "Chiara",
  "Samuel",
  "Ines",
  "Tariq",
  "Greta",
  "Arjun",
  "Maja",
  "Kofi",
  "Lena",
];

const LAST_NAMES = [
  "Krüger",
  "Hoffmann",
  "Haddad",
  "Fischer",
  "Vogel",
  "Schmidt",
  "Weber",
  "Yilmaz",
  "Becker",
  "Nasser",
  "Wagner",
  "Demir",
  "Klein",
  "Kaya",
  "Wolf",
  "Rossi",
  "Mansour",
  "Braun",
  "Öztürk",
  "Richter",
  "Nowak",
  "Aksoy",
  "Lang",
  "Arslan",
  "Hartmann",
  "Kowalski",
  "Patel",
  "Schulz",
  "Çelik",
  "Iyer",
  "Neumann",
  "Bianchi",
  "Mensah",
  "Costa",
  "Rahimi",
  "Lindner",
  "Sharma",
  "Zielinski",
  "Owusu",
  "Keller",
];

const ZONE_HEADCOUNT: Record<string, number[]> = {
  innenstadt: [5, 1, 2, 6, 4],
  sachsenhausen: [3, 1, 1, 3, 3],
  nordend: [4, 1, 2, 5, 3],
  bornheim: [2, 1, 1, 4, 2],
  bockenheim: [3, 1, 1, 4, 2],
  westend: [2, 1, 1, 3, 2],
  ostend: [2, 1, 1, 3, 2],
  gallus: [2, 1, 1, 2, 2],
};

const OPTIONAL_KINDS: DocumentKind[] = [
  "fuehrerschein",
  "uvv_inspection",
  "insurance",
  "bg_verkehr_reg",
  "a1_certificate",
];

const REFERENCE_PREFIX: Record<DocumentKind, string> = {
  aufenthaltstitel: "ABH",
  duldung: "DLD",
  fuehrerschein: "FSK",
  uvv_inspection: "UVV",
  insurance: "PHV",
  bg_verkehr_reg: "BGV",
  a1_certificate: "A1P",
  work_contract: "AV",
};

function hashName(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 1831565813) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(date: Date, days: number): string {
  return isoDate(new Date(date.getTime() + days * 86_400_000));
}

function offsetForBand(random: () => number, band: "crit" | "warn" | "good"): number {
  if (band === "crit") return Math.round(random() * 33) - 20;
  if (band === "warn") return 14 + Math.round(random() * 46);
  return 61 + Math.round(random() * 479);
}

function pilotRiders(): { id: string; name: string }[] {
  const riders: { id: string; name: string }[] = [];
  let sequence = 0;
  for (const zone of Object.keys(ZONE_HEADCOUNT)) {
    for (const count of ZONE_HEADCOUNT[zone]) {
      for (let slot = 0; slot < count; slot += 1) {
        sequence += 1;
        riders.push({
          id: `D${String(sequence).padStart(3, "0")}`,
          name: `${FIRST_NAMES[(sequence * 7) % FIRST_NAMES.length]} ${LAST_NAMES[(sequence * 11) % LAST_NAMES.length]}`,
        });
      }
    }
  }
  return riders;
}

function documentsForRider(riderId: string, asOf: Date): Omit<CreateDocument, "riderName">[] {
  const random = mulberry32(hashName(riderId) ^ 2654435761);
  const count = 5 + Math.floor(random() * 4);
  const kinds: DocumentKind[] = ["work_contract"];
  kinds.push(random() < 0.75 ? "aufenthaltstitel" : "duldung");
  const pool = [...OPTIONAL_KINDS];
  while (kinds.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    kinds.push(pool.splice(index, 1)[0]);
  }
  const bands: Array<"crit" | "warn" | "good"> = ["crit", "warn", "good"];
  while (bands.length < kinds.length) {
    const roll = random();
    bands.push(roll < 0.15 ? "crit" : roll < 0.4 ? "warn" : "good");
  }
  for (let index = bands.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [bands[index], bands[swap]] = [bands[swap], bands[index]];
  }
  return kinds.map((kind, index) => {
    const daysLeft = offsetForBand(random, bands[index]);
    const expiresOn = shiftDate(asOf, daysLeft);
    const validity =
      kind === "aufenthaltstitel"
        ? 365 * (1 + Math.floor(random() * 3))
        : kind === "duldung"
          ? 90 + Math.floor(random() * 90)
          : kind === "work_contract"
            ? 30 + Math.floor(random() * 400)
            : kind === "fuehrerschein"
              ? 90 + Math.floor(random() * 90)
              : 180 + Math.floor(random() * 360);
    const issuedOn = shiftDate(new Date(asOf.getTime() + daysLeft * 86_400_000), -validity);
    const serial = String(1000 + Math.floor(random() * 9000));
    return {
      id: `${riderId}-${kind}`,
      riderId,
      kind,
      expiresOn,
      issuedOn,
      reference: `${REFERENCE_PREFIX[kind]}-${expiresOn.slice(0, 4)}-${serial}`,
      fileName: `${kind}_${riderId}_${serial}.pdf`,
    };
  });
}

export function buildPortalDocuments(): CreateDocument[] {
  const asOf = new Date(`${DOCUMENT_AS_OF}T00:00:00Z`);
  const riders = pilotRiders();
  const names = new Map(riders.map((rider) => [rider.id, rider.name]));
  return riders.flatMap((rider) =>
    documentsForRider(rider.id, asOf).map((document) => ({
      ...document,
      riderName: names.get(document.riderId) ?? document.riderId,
    })),
  );
}
