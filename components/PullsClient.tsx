"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";
import { FormDrawer } from "@/components/FormDrawer";
import { EmptyState } from "@/components/EmptyState";
import { PullForm } from "@/components/forms/PullForm";
import { PullsTimelineChart } from "@/components/charts/PullsTimelineChart";
import { formatDate, formatSeconds } from "@/lib/format";
import type { Pull } from "@/lib/types";

export function PullsClient({ pulls }: { pulls: Pull[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Pull | null>(null);

  async function onDelete(id: string) {
    if (!confirm("Delete this pull?")) return;
    await fetch(`/api/pulls/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const sortedDesc = [...pulls].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="flex justify-end">
        <FormDrawer
          title="Log pull"
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Log pull
            </Button>
          }
        >
          {(close) => <PullForm onDone={close} />}
        </FormDrawer>
      </div>

      {pulls.length === 0 ? (
        <EmptyState
          title="No pulls logged yet"
          description="Log a pull to see times trend over weather, weight, and mods."
        />
      ) : (
        <>
          <PullsTimelineChart pulls={pulls} />

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {sortedDesc.map((p) => {
              const open = expanded === p.id;
              return (
                <div
                  key={p.id}
                  className="border-t border-border first:border-t-0"
                >
                  <button
                    onClick={() => setExpanded(open ? null : p.id)}
                    className="grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2/60"
                  >
                    <div className="num col-span-3 text-sm">
                      {formatDate(p.date)}
                    </div>
                    <div className="num col-span-2 text-sm text-fg-dim">
                      {formatSeconds(p.time50to100)}
                    </div>
                    <div className="num col-span-2 text-sm text-fg-dim">
                      {formatSeconds(p.time80to160)}
                    </div>
                    <div className="num col-span-2 text-sm text-fg-dim">
                      {formatSeconds(p.time100to200)}
                    </div>
                    <div className="col-span-2 text-sm text-fg-muted truncate">
                      {p.location || ""}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {open ? (
                        <ChevronUp className="h-4 w-4 text-fg-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-fg-muted" />
                      )}
                    </div>
                  </button>
                  {open && (
                    <div className="border-t border-border bg-bg/40 px-4 py-3">
                      <div className="grid grid-cols-2 gap-3 text-xs text-fg-dim sm:grid-cols-4">
                        <div>
                          <span className="text-fg-muted">Temp:</span>{" "}
                          <span className="num">
                            {p.tempC != null ? `${p.tempC}°C` : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-fg-muted">Road:</span>{" "}
                          {p.roadSurface || "—"}
                        </div>
                        <div>
                          <span className="text-fg-muted">Gear:</span>{" "}
                          {p.gear || "—"}
                        </div>
                        <div>
                          <span className="text-fg-muted">Weight:</span>{" "}
                          <span className="num">
                            {p.weightKg != null ? `${p.weightKg} kg` : "—"}
                          </span>
                        </div>
                        {p.tirePressures && (
                          <div className="col-span-2 sm:col-span-4">
                            <span className="text-fg-muted">
                              Tires (psi):
                            </span>{" "}
                            <span className="num">
                              FL {p.tirePressures.fl} · FR {p.tirePressures.fr}{" "}
                              · RL {p.tirePressures.rl} · RR{" "}
                              {p.tirePressures.rr}
                            </span>
                          </div>
                        )}
                        {p.notes && (
                          <div className="col-span-2 whitespace-pre-wrap sm:col-span-4">
                            <span className="text-fg-muted">Notes:</span>{" "}
                            {p.notes}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex justify-end gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          className="rounded p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="rounded p-1 text-fg-dim hover:bg-danger/20 hover:text-danger"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t border-border bg-surface-2/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">Date</div>
                <div className="col-span-2">50–100</div>
                <div className="col-span-2">80–160</div>
                <div className="col-span-2">100–200</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1" />
              </div>
            </div>
          </div>
        </>
      )}

      {editing && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setEditing(null)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest">
                Edit pull
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <PullForm initial={editing} onDone={() => setEditing(null)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
