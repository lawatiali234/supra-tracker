import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { deleteItem, updateItem } from "@/lib/store";
import type { Mod } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<Mod>;
  if (patch.cost != null) patch.cost = Number(patch.cost) || 0;
  if (patch.mileageAtInstall != null)
    patch.mileageAtInstall = Number(patch.mileageAtInstall) || 0;
  const items = await updateItem<Mod>(KEYS.mods, id, patch);
  return NextResponse.json({ items });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const items = await deleteItem<Mod>(KEYS.mods, id);
  return NextResponse.json({ items });
}
