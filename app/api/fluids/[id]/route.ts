import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { deleteItem, updateItem } from "@/lib/store";
import type { Fluid } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<Fluid>;
  if (patch.quantity != null) patch.quantity = Number(patch.quantity) || 0;
  if (patch.lowStockThreshold != null)
    patch.lowStockThreshold = Number(patch.lowStockThreshold) || 0;
  const items = await updateItem<Fluid>(KEYS.fluids, id, patch);
  return NextResponse.json({ items });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const items = await deleteItem<Fluid>(KEYS.fluids, id);
  return NextResponse.json({ items });
}
