"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, NumberInput, Select, TextInput, Textarea } from "@/components/Field";
import { MOD_CATEGORY_LABELS, type Mod, type ModCategory } from "@/lib/types";

interface Props {
  initial?: Mod;
  onDone: () => void;
}

export function ModForm({ initial, onDone }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<ModCategory>(
    initial?.category ?? "tune",
  );
  const [installDate, setInstallDate] = useState(
    initial?.installDate ?? new Date().toISOString().slice(0, 10),
  );
  const [mileageAtInstall, setMileageAtInstall] = useState(
    String(initial?.mileageAtInstall ?? ""),
  );
  const [cost, setCost] = useState(String(initial?.cost ?? ""));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name,
        category,
        installDate,
        mileageAtInstall: Number(mileageAtInstall) || 0,
        cost: Number(cost) || 0,
        notes: notes || undefined,
      };
      const url = initial ? `/api/mods/${initial.id}` : "/api/mods";
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
      <Field label="Name">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. BM3 Stage 2"
          required
        />
      </Field>
      <Field label="Category">
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value as ModCategory)}
        >
          {Object.entries(MOD_CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Install date">
        <TextInput
          type="date"
          value={installDate}
          onChange={(e) => setInstallDate(e.target.value)}
        />
      </Field>
      <Field label="Mileage at install (km)">
        <NumberInput
          value={mileageAtInstall}
          onChange={(e) => setMileageAtInstall(e.target.value)}
          min={0}
        />
      </Field>
      <Field label="Cost (OMR)">
        <NumberInput
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          min={0}
          step="0.001"
        />
      </Field>
      <Field label="Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Map version, part numbers, install shop, before/after impressions…"
        />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving…" : initial ? "Save changes" : "Add mod"}
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
