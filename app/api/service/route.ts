import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { appendItem, getList, getObject, setObject } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Profile, ServiceEntry } from "@/lib/types";

export async function GET() {
  const items = await getList<ServiceEntry>(KEYS.service);
  items.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<ServiceEntry, "id" | "createdAt">;
  const item: ServiceEntry = {
    ...body,
    cost: Number(body.cost) || 0,
    mileage: Number(body.mileage) || 0,
    id: newId(),
    createdAt: nowIso(),
  };
  const items = await appendItem(KEYS.service, item);

  // Bump profile.currentMileage if this entry exceeds it
  const profile =
    (await getObject<Profile>(KEYS.profile)) ?? { currentMileage: 0 };
  if (item.mileage > (profile.currentMileage ?? 0)) {
    await setObject(KEYS.profile, { ...profile, currentMileage: item.mileage });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ item, items });
}
