"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, NumberInput, Select, TextInput, Textarea } from "@/components/Field";
import {
  SERVICE_TYPE_LABELS,
  type ServiceEntry,
  type ServiceType,
} from "@/lib/types";

interface Props {
  initial?: ServiceEntry;
  onDone: () => void;
}

export function ServiceForm({ initial, onDone }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [mileage, setMileage] = useState(String(initial?.mileage ?? ""));
  const [type, setType] = useState<ServiceType>(initial?.type ?? "oil");
  const [shop, setShop] = useState(initial?.shop ?? "");
  const [partsUsed, setPartsUsed] = useState(initial?.partsUsed ?? "");
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
        date,
        mileage: Number(mileage),
        type,
        shop: shop || undefined,
        partsUsed: partsUsed || undefined,
        cost: Number(cost) || 0,
        notes: notes || undefined,
      };
      const url = initial ? `/api/service/${initial.id}` : "/api/service";
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
      <Field label="Date">
        <TextInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Field>
      <Field label="Mileage (km)">
        <NumberInput
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          min={0}
          required
          placeholder="e.g. 30760"
        />
      </Field>
      <Field label="Service type">
        <Select value={type} onChange={(e) => setType(e.target.value as ServiceType)}>
          {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Shop">
        <TextInput
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          placeholder="e.g. Sherif's, dealer, DIY"
        />
      </Field>
      <Field label="Parts used" hint="Free text — brand, part numbers, fluids, etc.">
        <Textarea
          value={partsUsed}
          onChange={(e) => setPartsUsed(e.target.value)}
        />
      </Field>
      <Field label="Cost (OMR)">
        <NumberInput
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          min={0}
          step="0.001"
          placeholder="0.000"
        />
      </Field>
      <Field label="Notes">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving…" : initial ? "Save changes" : "Log service"}
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
