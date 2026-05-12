"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormDrawer } from "@/components/FormDrawer";
import { Button } from "@/components/Button";
import { DataTable, type Column } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { formatDate, formatKm, formatOMR } from "@/lib/format";
import { SERVICE_TYPE_LABELS, type ServiceEntry } from "@/lib/types";

interface Props {
  service: ServiceEntry[];
}

export function ServiceClient({ service }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<ServiceEntry | null>(null);

  async function onDelete(id: string) {
    if (!confirm("Delete this service entry?")) return;
    await fetch(`/api/service/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const columns: Column<ServiceEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (r) => <span className="num">{formatDate(r.date)}</span>,
    },
    {
      key: "mileage",
      header: "Mileage",
      align: "right",
      render: (r) => <span className="num">{formatKm(r.mileage)}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (r) => (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">
          {SERVICE_TYPE_LABELS[r.type] ?? r.type}
        </span>
      ),
    },
    {
      key: "shop",
      header: "Shop",
      render: (r) => r.shop || <span className="text-fg-muted">—</span>,
    },
    {
      key: "parts",
      header: "Parts",
      render: (r) => (
        <span className="line-clamp-2 max-w-xs text-fg-dim">
          {r.partsUsed || <span className="text-fg-muted">—</span>}
        </span>
      ),
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      render: (r) => <span className="num">{formatOMR(r.cost)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => setEditing(r)}
            className="rounded p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(r.id)}
            className="rounded p-1 text-fg-dim hover:bg-danger/20 hover:text-danger"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end">
        <FormDrawer
          title="Log service"
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Log service
            </Button>
          }
        >
          {(close) => <ServiceForm onDone={close} />}
        </FormDrawer>
      </div>

      <DataTable
        columns={columns}
        rows={service}
        rowKey={(r) => r.id}
        empty={
          <EmptyState
            title="No service entries yet"
            description="Log your first oil change, brake fluid flush, plug swap, or inspection."
          />
        }
      />

      {/* Edit drawer — controlled via state, mounted only when editing */}
      {editing && (
        <EditDrawer entry={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function EditDrawer({
  entry,
  onClose,
}: {
  entry: ServiceEntry;
  onClose: () => void;
}) {
  // Render an open drawer using FormDrawer with auto-open via trigger click trick.
  // Simpler: a lightweight inline drawer.
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            Edit service
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
            aria-label="Close"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ServiceForm initial={entry} onDone={onClose} />
        </div>
      </aside>
    </>
  );
}
