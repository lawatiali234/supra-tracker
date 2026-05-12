"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, MessageSquarePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/Button";
import { FormDrawer } from "@/components/FormDrawer";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { IssueForm } from "@/components/forms/IssueForm";
import { Field, Textarea } from "@/components/Field";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  ISSUE_STATUS_LABELS,
  type Issue,
  type IssueStatus,
} from "@/lib/types";

const STATUSES: IssueStatus[] = ["open", "monitoring", "resolved"];

export function IssuesClient({ issues }: { issues: Issue[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Issue | null>(null);

  const grouped = useMemo(() => {
    const g: Record<IssueStatus, Issue[]> = {
      open: [],
      monitoring: [],
      resolved: [],
    };
    for (const i of issues) g[i.status].push(i);
    for (const k of STATUSES) {
      g[k].sort((a, b) => b.openedDate.localeCompare(a.openedDate));
    }
    return g;
  }, [issues]);

  async function changeStatus(id: string, status: IssueStatus) {
    await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this issue and all its notes?")) return;
    await fetch(`/api/issues/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end">
        <FormDrawer
          title="New issue"
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              New issue
            </Button>
          }
        >
          {(close) => <IssueForm onDone={close} />}
        </FormDrawer>
      </div>

      {issues.length === 0 ? (
        <EmptyState
          title="No issues logged"
          description="Track recurring annoyances and the path to resolving them — cold-start hiccups, phantom warnings, etc."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {STATUSES.map((status) => (
            <div key={status} className="space-y-3">
              <header className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                  {ISSUE_STATUS_LABELS[status]}
                </h3>
                <span className="num text-xs text-fg-muted">
                  {grouped[status].length}
                </span>
              </header>
              <div className="space-y-2">
                {grouped[status].length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-surface/30 px-4 py-6 text-center text-xs text-fg-muted">
                    Nothing here.
                  </div>
                ) : (
                  grouped[status].map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      expanded={expanded === issue.id}
                      onToggle={() =>
                        setExpanded(expanded === issue.id ? null : issue.id)
                      }
                      onChangeStatus={(s) => changeStatus(issue.id, s)}
                      onEdit={() => setEditing(issue)}
                      onDelete={() => onDelete(issue.id)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
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
                Edit issue
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <IssueForm initial={editing} onDone={() => setEditing(null)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function IssueCard({
  issue,
  expanded,
  onToggle,
  onChangeStatus,
  onEdit,
  onDelete,
}: {
  issue: Issue;
  expanded: boolean;
  onToggle: () => void;
  onChangeStatus: (s: IssueStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [noteBody, setNoteBody] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setSubmittingNote(true);
    await fetch(`/api/issues/${issue.id}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: noteBody.trim() }),
    });
    setNoteBody("");
    setSubmittingNote(false);
    router.refresh();
  }

  return (
    <article className="rounded-xl border border-border bg-surface">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusBadge variant={issue.status}>
              {ISSUE_STATUS_LABELS[issue.status]}
            </StatusBadge>
            <span className="num text-[11px] text-fg-muted">
              {formatDate(issue.openedDate)}
            </span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-fg">{issue.title}</h4>
          {issue.notes.length > 0 && (
            <p className="num mt-0.5 text-[11px] text-fg-muted">
              {issue.notes.length}{" "}
              {issue.notes.length === 1 ? "note" : "notes"}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-4 w-4 text-fg-muted" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 text-fg-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          {issue.description && (
            <p className="text-sm text-fg-dim">{issue.description}</p>
          )}
          {issue.resolvedDate && (
            <p className="num mt-1 text-[11px] text-fg-muted">
              Resolved {formatDate(issue.resolvedDate)}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onChangeStatus(s)}
                disabled={s === issue.status}
                className={clsx(
                  "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                  s === issue.status
                    ? "cursor-default border-accent bg-accent/10 text-accent"
                    : "border-border text-fg-dim hover:bg-surface-2 hover:text-fg",
                )}
              >
                Mark {ISSUE_STATUS_LABELS[s]}
              </button>
            ))}
            <div className="ml-auto flex gap-1">
              <button
                onClick={onEdit}
                className="rounded p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
                aria-label="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="rounded p-1 text-fg-dim hover:bg-danger/20 hover:text-danger"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <h5 className="text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
              Notes
            </h5>
            {issue.notes.length === 0 ? (
              <p className="mt-1 text-xs text-fg-muted">No notes yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {[...issue.notes]
                  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                  .map((n) => (
                    <li
                      key={n.id}
                      className="rounded-md border border-border bg-bg p-2.5"
                    >
                      <div className="num text-[10px] text-fg-muted">
                        {formatDateTime(n.timestamp)}
                      </div>
                      <div className="mt-0.5 whitespace-pre-wrap text-sm text-fg-dim">
                        {n.body}
                      </div>
                    </li>
                  ))}
              </ul>
            )}

            <form onSubmit={addNote} className="mt-3 space-y-2">
              <Field label="Add note">
                <Textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="What changed? Diagnostic, fix attempt, return visit…"
                  rows={2}
                />
              </Field>
              <Button
                type="submit"
                size="sm"
                disabled={submittingNote || !noteBody.trim()}
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                {submittingNote ? "Adding…" : "Add note"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
