import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { appendItem, getList } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Pull } from "@/lib/types";

export async function GET() {
  const items = await getList<Pull>(KEYS.pulls);
  items.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Pull, "id" | "createdAt">;
  const item: Pull = {
    ...body,
    id: newId(),
    createdAt: nowIso(),
  };
  const items = await appendItem(KEYS.pulls, item);
  items.sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ item, items });
}
