export interface ReportFact {
  platformId: string;
  platform: string;
  zone: string;
  restaurant: string;
  driver: string;
  delayCause: string;
  hour: string;
  employment: string;
  delivered: boolean;
  onTime: boolean;
  late: boolean;
  cancelled: boolean;
  deliveryMinutes: number | null;
  revenue: number;
}

export interface ReportPlatformOption {
  id: string;
  name: string;
}

export interface ReportPage {
  asOf: string;
  count: number;
  platforms: ReportPlatformOption[];
  rows: ReportFact[];
}
