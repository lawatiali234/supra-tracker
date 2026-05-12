import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { appendItem, getList } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Issue } from "@/lib/types";

export async function GET() {
  const items = await getList<Issue>(KEYS.issues);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<
    Issue,
    "id" | "createdAt" | "notes"
  >;
  const item: Issue = {
    ...body,
    id: newId(),
    notes: [],
    createdAt: nowIso(),
  };
  const items = await appendItem(KEYS.issues, item);
  return NextResponse.json({ item, items });
}
