import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { deleteItem, getList, setList } from "@/lib/store";
import { nowIso } from "@/lib/ids";
import type { Issue } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<Issue>;
  const items = await getList<Issue>(KEYS.issues);
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return NextResponse.json({ items });
  const prev = items[idx];
  const next: Issue = {
    ...prev,
    ...patch,
    id: prev.id,
    notes: prev.notes, // notes never edited via this route
  };
  // If status flipped to resolved and no resolvedDate, stamp it now
  if (
    patch.status === "resolved" &&
    prev.status !== "resolved" &&
    !patch.resolvedDate
  ) {
    next.resolvedDate = nowIso().slice(0, 10);
  }
  // If un-resolved, clear resolvedDate
  if (patch.status && patch.status !== "resolved") {
    next.resolvedDate = undefined;
  }
  items[idx] = next;
  await setList(KEYS.issues, items);
  return NextResponse.json({ items });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const items = await deleteItem<Issue>(KEYS.issues, id);
  return NextResponse.json({ items });
}
