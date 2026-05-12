export type ServiceType =
  | "oil"
  | "brake_fluid"
  | "spark_plugs"
  | "coolant"
  | "inspection"
  | "other";

export type ModCategory =
  | "tune"
  | "intake_exhaust"
  | "brakes"
  | "wheels"
  | "exterior"
  | "other";

export type IssueStatus = "open" | "monitoring" | "resolved";

export interface Profile {
  currentMileage: number;
  vin?: string;
  plate?: string;
  purchaseDate?: string;
  notes?: string;
}

export interface MileageLogEntry {
  id: string;
  date: string;
  km: number;
}

export interface Mod {
  id: string;
  name: string;
  category: ModCategory;
  installDate: string;
  mileageAtInstall: number;
  cost: number;
  notes?: string;
  createdAt: string;
}

export interface ServiceEntry {
  id: string;
  date: string;
  mileage: number;
  type: ServiceType;
  shop?: string;
  partsUsed?: string;
  cost: number;
  notes?: string;
  createdAt: string;
}

export interface IssueNote {
  id: string;
  timestamp: string;
  body: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  openedDate: string;
  resolvedDate?: string;
  notes: IssueNote[];
  createdAt: string;
}

export interface TirePressures {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface Pull {
  id: string;
  date: string;
  location?: string;
  tempC?: number;
  roadSurface?: string;
  time50to100?: number;
  time80to160?: number;
  time100to200?: number;
  gear?: string;
  tirePressures?: TirePressures;
  weightKg?: number;
  notes?: string;
  createdAt: string;
}

export interface Fluid {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  lowStockThreshold: number;
  expiry?: string;
  notes?: string;
  createdAt: string;
}

export const SERVICE_INTERVALS_KM: Record<ServiceType, number | null> = {
  oil: 5240,
  brake_fluid: 30000,
  // Tuned-car interval: 25-30k km (vs 60k OEM B58 spec)
  spark_plugs: 28000,
  coolant: 60000,
  inspection: 10000,
  other: null,
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  oil: "Oil change",
  brake_fluid: "Brake fluid",
  spark_plugs: "Spark plugs",
  coolant: "Coolant",
  inspection: "Inspection",
  other: "Other",
};

export const MOD_CATEGORY_LABELS: Record<ModCategory, string> = {
  tune: "Tune",
  intake_exhaust: "Intake & Exhaust",
  brakes: "Brakes",
  wheels: "Wheels",
  exterior: "Exterior",
  other: "Other",
};

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  monitoring: "Monitoring",
  resolved: "Resolved",
};
