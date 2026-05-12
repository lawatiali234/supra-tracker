import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { getObject, setObject } from "@/lib/store";
import type { Profile } from "@/lib/types";

export async function GET() {
  const profile = (await getObject<Profile>(KEYS.profile)) ?? {
    currentMileage: 0,
  };
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<Profile>;
  const current =
    (await getObject<Profile>(KEYS.profile)) ?? { currentMileage: 0 };
  const next: Profile = { ...current, ...body };
  if (typeof next.currentMileage !== "number") next.currentMileage = 0;
  await setObject(KEYS.profile, next);
  return NextResponse.json(next);
}
