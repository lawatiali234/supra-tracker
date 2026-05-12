import { KEYS } from "./keys";
import { getList, getObject } from "./store";
import type {
  Fluid,
  Issue,
  MileageLogEntry,
  Mod,
  Profile,
  Pull,
  ServiceEntry,
} from "./types";

export async function fetchProfile(): Promise<Profile> {
  return (
    (await getObject<Profile>(KEYS.profile)) ?? { currentMileage: 0 }
  );
}

export async function fetchMileageLog(): Promise<MileageLogEntry[]> {
  const log = await getList<MileageLogEntry>(KEYS.mileageLog);
  log.sort((a, b) => a.date.localeCompare(b.date));
  return log;
}

export async function fetchMods(): Promise<Mod[]> {
  return getList<Mod>(KEYS.mods);
}

export async function fetchService(): Promise<ServiceEntry[]> {
  const items = await getList<ServiceEntry>(KEYS.service);
  items.sort((a, b) => b.date.localeCompare(a.date));
  return items;
}

export async function fetchIssues(): Promise<Issue[]> {
  return getList<Issue>(KEYS.issues);
}

export async function fetchPulls(): Promise<Pull[]> {
  const items = await getList<Pull>(KEYS.pulls);
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

export async function fetchFluids(): Promise<Fluid[]> {
  return getList<Fluid>(KEYS.fluids);
}
