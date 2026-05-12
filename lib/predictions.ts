import type {
  MileageLogEntry,
  Profile,
  ServiceEntry,
  ServiceType,
} from "./types";
import { SERVICE_INTERVALS_KM } from "./types";

export interface OilStatus {
  hasData: boolean;
  lastOilMileage?: number;
  lastOilDate?: string;
  intervalKm: number;
  nextDueMileage?: number;
  kmUntilDue?: number;
  percentUsed: number; // 0..1, clamped
}

export function getLatestServiceOfType(
  service: ServiceEntry[],
  type: ServiceType,
): ServiceEntry | undefined {
  return service
    .filter((s) => s.type === type)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function oilStatus(
  service: ServiceEntry[],
  profile: Profile | null,
): OilStatus {
  const interval = SERVICE_INTERVALS_KM.oil ?? 5000;
  const last = getLatestServiceOfType(service, "oil");
  if (!last) {
    return { hasData: false, intervalKm: interval, percentUsed: 0 };
  }
  const currentMileage = profile?.currentMileage ?? last.mileage;
  const nextDue = last.mileage + interval;
  const used = Math.max(0, currentMileage - last.mileage);
  const percent = Math.min(1, Math.max(0, used / interval));
  return {
    hasData: true,
    lastOilMileage: last.mileage,
    lastOilDate: last.date,
    intervalKm: interval,
    nextDueMileage: nextDue,
    kmUntilDue: nextDue - currentMileage,
    percentUsed: percent,
  };
}

export interface NextServiceDue {
  type: ServiceType;
  hasData: boolean;
  lastMileage?: number;
  lastDate?: string;
  intervalKm: number | null;
  nextDueMileage?: number;
  kmUntilDue?: number;
}

export function nextServiceDue(
  service: ServiceEntry[],
  profile: Profile | null,
  type: ServiceType,
): NextServiceDue {
  const interval = SERVICE_INTERVALS_KM[type];
  const last = getLatestServiceOfType(service, type);
  if (!last || interval == null) {
    return { type, hasData: false, intervalKm: interval };
  }
  const currentMileage = profile?.currentMileage ?? last.mileage;
  const nextDue = last.mileage + interval;
  return {
    type,
    hasData: true,
    lastMileage: last.mileage,
    lastDate: last.date,
    intervalKm: interval,
    nextDueMileage: nextDue,
    kmUntilDue: nextDue - currentMileage,
  };
}

export interface MileageProjection {
  hasData: boolean;
  kmPerMonth?: number;
  monthsSpanned?: number;
  totalKm?: number;
}

export function mileageProjection(
  log: MileageLogEntry[],
): MileageProjection {
  if (log.length < 2) return { hasData: false };
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const ms =
    new Date(last.date).getTime() - new Date(first.date).getTime();
  const months = ms / (1000 * 60 * 60 * 24 * 30.4375);
  if (months <= 0) return { hasData: false };
  const totalKm = last.km - first.km;
  return {
    hasData: true,
    kmPerMonth: totalKm / months,
    monthsSpanned: months,
    totalKm,
  };
}

export function sumCosts(items: Array<{ cost: number }>): number {
  return items.reduce((acc, x) => acc + (Number(x.cost) || 0), 0);
}
