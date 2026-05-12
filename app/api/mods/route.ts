import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { appendItem, getList } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Mod } from "@/lib/types";

export async function GET() {
  const items = await getList<Mod>(KEYS.mods);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Mod, "id" | "createdAt">;
  const item: Mod = {
    ...body,
    cost: Number(body.cost) || 0,
    mileageAtInstall: Number(body.mileageAtInstall) || 0,
    id: newId(),
    createdAt: nowIso(),
  };
  const items = await appendItem(KEYS.mods, item);
  return NextResponse.json({ item, items });
}
