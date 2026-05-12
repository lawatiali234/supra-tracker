import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { deleteItem, updateItem } from "@/lib/store";
import type { ServiceEntry } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<ServiceEntry>;
  if (patch.cost != null) patch.cost = Number(patch.cost) || 0;
  if (patch.mileage != null) patch.mileage = Number(patch.mileage) || 0;
  const items = await updateItem<ServiceEntry>(KEYS.service, id, patch);
  return NextResponse.json({ items });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const items = await deleteItem<ServiceEntry>(KEYS.service, id);
  return NextResponse.json({ items });
}
