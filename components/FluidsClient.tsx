"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";
import { FormDrawer } from "@/components/FormDrawer";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { FluidForm } from "@/components/forms/FluidForm";
import { formatDate } from "@/lib/format";
import type { Fluid } from "@/lib/types";

type Filter = "all" | "low" | "expiring";

function expiringSoon(expiry?: string): boolean {
  if (!expiry) return false;
  const d = new Date(expiry).getTime();
  if (Number.isNaN(d)) return false;
  const days = (d - Date.now()) / (1000 * 60 * 60 * 24);
  return days <= 30 && days >= 0;
}

function expired(expiry?: string): boolean {
  if (!expiry) return false;
  const d = new Date(expiry).getTime();
  if (Number.isNaN(d)) return false;
  return d < Date.now();
}

export function FluidsClient({ fluids }: { fluids: Fluid[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Fluid | null>(null);

  const filtered = useMemo(() => {
    const list = fluids.filter((f) => {
      if (filter === "low") return f.quantity <= f.lowStockThreshold;
      if (filter === "expiring") return expiringSoon(f.expiry) || expired(f.expiry);
      return true;
    });
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [fluids, filter]);

  const lowCount = fluids.filter((f) => f.quantity <= f.lowStockThreshold).length;
  const expiringCount = fluids.filter(
    (f) => expiringSoon(f.expiry) || expired(f.expiry),
  ).length;

  async function onDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/fluids/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {(
            [
              { key: "all", label: "All", count: fluids.length },
              { key: "low", label: "Low stock", count: lowCount },
              {
                key: "expiring",
                label: "Expiring",
                count: expiringCount,
              },
            ] as { key: Filter; label: string; count: number }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-accent text-black"
                  : "border border-border bg-surface text-fg-dim hover:bg-surface-2 hover:text-fg",
              )}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-70">{f.count}</span>
            </button>
          ))}
        </div>
        <FormDrawer
          title="Add item"
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          }
        >
          {(close) => <FluidForm onDone={close} />}
        </FormDrawer>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={
            fluids.length === 0
              ? "Nothing tracked yet"
              : "Nothing matches this filter"
          }
          description={
            fluids.length === 0
              ? "Track what you have on the shelf — spare oil, brake fluid, plugs, pads, wipers."
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => {
            const isLow = f.quantity <= f.lowStockThreshold;
            const isExpiring = expiringSoon(f.expiry);
            const isExpired = expired(f.expiry);
            return (
              <article
                key={f.id}
                className="group rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-fg">{f.name}</h3>
                    <div className="num mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold text-fg">
                        {f.quantity}
                      </span>
                      {f.unit && (
                        <span className="text-sm text-fg-dim">{f.unit}</span>
                      )}
                    </div>
                    <div className="num mt-0.5 text-[11px] text-fg-muted">
                      threshold {f.lowStockThreshold}
                      {f.unit ? ` ${f.unit}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {isLow && <StatusBadge variant="low">Low</StatusBadge>}
                    {isExpired && (
                      <StatusBadge variant="warn">Expired</StatusBadge>
                    )}
                    {!isExpired && isExpiring && (
                      <StatusBadge variant="warn">Expiring</StatusBadge>
                    )}
                  </div>
                </div>
                {(f.expiry || f.notes) && (
                  <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-fg-dim">
                    {f.expiry && (
                      <div>
                        Expiry:{" "}
                        <span className="num text-fg">{formatDate(f.expiry)}</span>
                      </div>
                    )}
                    {f.notes && <p>{f.notes}</p>}
                  </div>
                )}
                <div className="mt-3 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(f)}
                    className="rounded p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(f.id)}
                    className="rounded p-1 text-fg-dim hover:bg-danger/20 hover:text-danger"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
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
                Edit item
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FluidForm initial={editing} onDone={() => setEditing(null)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
