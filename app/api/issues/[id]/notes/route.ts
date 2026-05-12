import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";
import { getList, setList } from "@/lib/store";
import { newId, nowIso } from "@/lib/ids";
import type { Issue, IssueNote } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json()) as { body: string };
  const items = await getList<Issue>(KEYS.issues);
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "issue not found" }, { status: 404 });
  }
  const note: IssueNote = {
    id: newId(),
    timestamp: nowIso(),
    body: body.body,
  };
  items[idx] = { ...items[idx], notes: [...items[idx].notes, note] };
  await setList(KEYS.issues, items);
  return NextResponse.json({ note, items });
}
