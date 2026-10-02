export interface PlatformWindow {
  kind: "rolling" | "daily";
  size?: number;
}

export interface PlatformPtod {
  label: string;
  measuredEvent: string;
  deadlineBasis: string;
  toleranceMin: number;
  excludeRestaurantWait: boolean;
  excludeCustomerWait: boolean;
  cancellations: string;
  window: PlatformWindow;
  batchRule: string;
  target: number;
  verified: boolean;
  source: string;
  notes: string;
}

export interface PlatformRecord {
  id: string;
  name: string;
  color: string;
  revenuePerDelivery: number;
  orderWeight: number;
  ptod: PlatformPtod;
}

export interface ZoneRecord {
  id: string;
  name: string;
  city: string;
  x: number;
  y: number;
  neighbors: string[];
  reserveDrivers: number;
  minutesPerOrder: number;
  demandShare: number;
}

export interface RestaurantRecord {
  id: string;
  name: string;
  zoneId: string;
  cuisine: string;
  readinessDelayMean: number;
  readinessDelaySd: number;
}

export interface EmploymentTypeRecord {
  id: string;
  hoursPerWeek: number;
  contractType: string;
  staffWeight: number;
  hourlyRate?: number;
}
