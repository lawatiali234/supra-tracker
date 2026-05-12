import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { appendItem, getList } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Fluid } from "@/lib/types";

export async function GET() {
  const items = await getList<Fluid>(KEYS.fluids);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Fluid, "id" | "createdAt">;
  const item: Fluid = {
    ...body,
    quantity: Number(body.quantity) || 0,
    lowStockThreshold: Number(body.lowStockThreshold) || 0,
    id: newId(),
    createdAt: nowIso(),
  };
  const items = await appendItem(KEYS.fluids, item);
  return NextResponse.json({ item, items });
}
