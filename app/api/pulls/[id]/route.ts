import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { deleteItem, updateItem } from "@/lib/store";
import type { Pull } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<Pull>;
  const items = await updateItem<Pull>(KEYS.pulls, id, patch);
  return NextResponse.json({ items });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const items = await deleteItem<Pull>(KEYS.pulls, id);
  return NextResponse.json({ items });
}
