"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, Select, TextInput, Textarea } from "@/components/Field";
import { ISSUE_STATUS_LABELS, type Issue, type IssueStatus } from "@/lib/types";

interface Props {
  initial?: Issue;
  onDone: () => void;
}

export function IssueForm({ initial, onDone }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<IssueStatus>(initial?.status ?? "open");
  const [openedDate, setOpenedDate] = useState(
    initial?.openedDate ?? new Date().toISOString().slice(0, 10),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title,
        description: description || undefined,
        status,
        openedDate,
      };
      const url = initial ? `/api/issues/${initial.id}` : "/api/issues";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Title">
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Right exhaust valve cold-start delay"
          required
        />
      </Field>
      <Field label="Description">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is happening, when, and any clues."
        />
      </Field>
      <Field label="Opened date">
        <TextInput
          type="date"
          value={openedDate}
          onChange={(e) => setOpenedDate(e.target.value)}
        />
      </Field>
      <Field label="Status">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as IssueStatus)}
        >
          {Object.entries(ISSUE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving…" : initial ? "Save changes" : "Open issue"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onDone}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
