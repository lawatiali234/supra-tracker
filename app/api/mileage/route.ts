import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import {
  appendItem,
  getList,
  getObject,
  setObject,
} from "@/lib/store";
import { newId } from "@/lib/ids";
import type { MileageLogEntry, Profile } from "@/lib/types";

export async function GET() {
  const log = await getList<MileageLogEntry>(KEYS.mileageLog);
  log.sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json(log);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { date: string; km: number };
  const entry: MileageLogEntry = {
    id: newId(),
    date: body.date,
    km: Number(body.km) || 0,
  };
  const items = await appendItem(KEYS.mileageLog, entry);

  // Bump profile.currentMileage if entry.km is higher
  const profile =
    (await getObject<Profile>(KEYS.profile)) ?? { currentMileage: 0 };
  if (entry.km > (profile.currentMileage ?? 0)) {
    await setObject(KEYS.profile, { ...profile, currentMileage: entry.km });
  }

  items.sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json({ entry, log: items });
}
