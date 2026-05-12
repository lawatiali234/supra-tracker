"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { Field, NumberInput, TextInput } from "@/components/Field";

export function MileageQuickForm() {
  const router = useRouter();
  const [km, setKm] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!km) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/mileage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, km: Number(km) }),
      });
      if (!res.ok) throw new Error("Failed");
      setKm("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label="Date">
        <TextInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Field>
      <Field label="Current mileage (km)">
        <NumberInput
          placeholder="e.g. 30760"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          min={0}
          required
        />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        <Plus className="h-4 w-4" />
        {submitting ? "Logging…" : "Log mileage"}
      </Button>
    </form>
  );
}
