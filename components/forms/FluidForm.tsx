"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, NumberInput, TextInput, Textarea } from "@/components/Field";
import type { Fluid } from "@/lib/types";

interface Props {
  initial?: Fluid;
  onDone: () => void;
}

export function FluidForm({ initial, onDone }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ""));
  const [unit, setUnit] = useState(initial?.unit ?? "L");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    String(initial?.lowStockThreshold ?? "1"),
  );
  const [expiry, setExpiry] = useState(initial?.expiry ?? "");
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
        quantity: Number(quantity) || 0,
        unit: unit || undefined,
        lowStockThreshold: Number(lowStockThreshold) || 0,
        expiry: expiry || undefined,
        notes: notes || undefined,
      };
      const url = initial ? `/api/fluids/${initial.id}` : "/api/fluids";
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
          placeholder="e.g. RBF 700, Motul 300V 5W-40, OEM brake pads front"
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantity on hand">
          <NumberInput
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={0}
            step="any"
            required
          />
        </Field>
        <Field label="Unit">
          <TextInput
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="L, pcs, set"
          />
        </Field>
      </div>
      <Field
        label="Low-stock threshold"
        hint="Show LOW badge when quantity hits this number."
      >
        <NumberInput
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          min={0}
          step="any"
        />
      </Field>
      <Field label="Expiry (optional)">
        <TextInput
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </Field>
      <Field label="Notes">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving…" : initial ? "Save changes" : "Add item"}
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
