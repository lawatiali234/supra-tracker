"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";
import { FormDrawer } from "@/components/FormDrawer";
import { EmptyState } from "@/components/EmptyState";
import { ModForm } from "@/components/forms/ModForm";
import { clsx } from "clsx";
import { formatDate, formatKm, formatOMR } from "@/lib/format";
import {
  MOD_CATEGORY_LABELS,
  type Mod,
  type ModCategory,
} from "@/lib/types";

type Filter = "all" | ModCategory;

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  ...(Object.entries(MOD_CATEGORY_LABELS).map(([k, v]) => ({
    key: k as ModCategory,
    label: v,
  })) as { key: Filter; label: string }[]),
];

export function ModsClient({ mods }: { mods: Mod[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Mod | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "all" ? mods : mods.filter((m) => m.category === filter);
    return [...list].sort((a, b) => b.installDate.localeCompare(a.installDate));
  }, [mods, filter]);

  const filteredTotal = filtered.reduce((a, m) => a + (m.cost || 0), 0);

  async function onDelete(id: string) {
    if (!confirm("Delete this mod?")) return;
    await fetch(`/api/mods/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={clsx(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                filter === t.key
                  ? "bg-accent text-black"
                  : "border border-border bg-surface text-fg-dim hover:bg-surface-2 hover:text-fg",
              )}
            >
              {t.label}
              {t.key !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {mods.filter((m) => m.category === t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <FormDrawer
          title="Add mod"
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Add mod
            </Button>
          }
        >
          {(close) => <ModForm onDone={close} />}
        </FormDrawer>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={
            mods.length === 0
              ? "No mods logged yet"
              : `Nothing in ${TABS.find((t) => t.key === filter)?.label ?? ""}`
          }
          description={
            mods.length === 0
              ? "Tune, intake, exhaust, brakes — log them here so you have a paper trail."
              : "Switch tabs or add a mod in this category."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-fg-dim">
                      {MOD_CATEGORY_LABELS[m.category]}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-semibold text-fg">{m.name}</h3>
                  <div className="num mt-1 text-xs text-fg-muted">
                    {formatDate(m.installDate)} · {formatKm(m.mileageAtInstall)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="num text-sm font-semibold text-accent">
                    {formatOMR(m.cost)}
                  </span>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditing(m)}
                      className="rounded p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="rounded p-1 text-fg-dim hover:bg-danger/20 hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {m.notes && (
                <p className="mt-3 text-sm text-fg-dim">{m.notes}</p>
              )}
            </article>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex items-center justify-end gap-3 text-xs text-fg-muted">
          <span>
            {filtered.length} {filtered.length === 1 ? "mod" : "mods"} ·{" "}
            <span className="num text-fg">{formatOMR(filteredTotal)}</span>
          </span>
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
                Edit mod
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ModForm initial={editing} onDone={() => setEditing(null)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
