"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, NumberInput, TextInput, Textarea } from "@/components/Field";
import type { Pull, TirePressures } from "@/lib/types";

interface Props {
  initial?: Pull;
  onDone: () => void;
}

export function PullForm({ initial, onDone }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [tempC, setTempC] = useState(
    initial?.tempC != null ? String(initial.tempC) : "",
  );
  const [roadSurface, setRoadSurface] = useState(initial?.roadSurface ?? "");
  const [t50, setT50] = useState(
    initial?.time50to100 != null ? String(initial.time50to100) : "",
  );
  const [t80, setT80] = useState(
    initial?.time80to160 != null ? String(initial.time80to160) : "",
  );
  const [t100, setT100] = useState(
    initial?.time100to200 != null ? String(initial.time100to200) : "",
  );
  const [gear, setGear] = useState(initial?.gear ?? "");
  const [fl, setFl] = useState(
    initial?.tirePressures?.fl != null ? String(initial.tirePressures.fl) : "",
  );
  const [fr, setFr] = useState(
    initial?.tirePressures?.fr != null ? String(initial.tirePressures.fr) : "",
  );
  const [rl, setRl] = useState(
    initial?.tirePressures?.rl != null ? String(initial.tirePressures.rl) : "",
  );
  const [rr, setRr] = useState(
    initial?.tirePressures?.rr != null ? String(initial.tirePressures.rr) : "",
  );
  const [weightKg, setWeightKg] = useState(
    initial?.weightKg != null ? String(initial.weightKg) : "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pressuresOrUndef(): TirePressures | undefined {
    const vals = [fl, fr, rl, rr];
    if (vals.every((v) => v === "")) return undefined;
    return {
      fl: Number(fl) || 0,
      fr: Number(fr) || 0,
      rl: Number(rl) || 0,
      rr: Number(rr) || 0,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        date,
        location: location || undefined,
        tempC: tempC ? Number(tempC) : undefined,
        roadSurface: roadSurface || undefined,
        time50to100: t50 ? Number(t50) : undefined,
        time80to160: t80 ? Number(t80) : undefined,
        time100to200: t100 ? Number(t100) : undefined,
        gear: gear || undefined,
        tirePressures: pressuresOrUndef(),
        weightKg: weightKg ? Number(weightKg) : undefined,
        notes: notes || undefined,
      };
      const url = initial ? `/api/pulls/${initial.id}` : "/api/pulls";
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
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location">
          <TextInput
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Highway, drag strip…"
          />
        </Field>
        <Field label="Temp (°C)">
          <NumberInput
            value={tempC}
            onChange={(e) => setTempC(e.target.value)}
            step="any"
          />
        </Field>
      </div>
      <Field label="Road surface">
        <TextInput
          value={roadSurface}
          onChange={(e) => setRoadSurface(e.target.value)}
          placeholder="smooth tarmac, slightly damp…"
        />
      </Field>

      <fieldset className="space-y-3 rounded-lg border border-border bg-bg p-3">
        <legend className="px-1 text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
          Times (seconds)
        </legend>
        <div className="grid grid-cols-3 gap-3">
          <Field label="50–100">
            <NumberInput
              value={t50}
              onChange={(e) => setT50(e.target.value)}
              step="0.01"
              placeholder="0.00"
            />
          </Field>
          <Field label="80–160">
            <NumberInput
              value={t80}
              onChange={(e) => setT80(e.target.value)}
              step="0.01"
              placeholder="0.00"
            />
          </Field>
          <Field label="100–200">
            <NumberInput
              value={t100}
              onChange={(e) => setT100(e.target.value)}
              step="0.01"
              placeholder="0.00"
            />
          </Field>
        </div>
        <Field label="Gear">
          <TextInput
            value={gear}
            onChange={(e) => setGear(e.target.value)}
            placeholder="e.g. 3rd–4th"
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-border bg-bg p-3">
        <legend className="px-1 text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
          Tire pressures (psi)
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="FL">
            <NumberInput
              value={fl}
              onChange={(e) => setFl(e.target.value)}
              step="any"
            />
          </Field>
          <Field label="FR">
            <NumberInput
              value={fr}
              onChange={(e) => setFr(e.target.value)}
              step="any"
            />
          </Field>
          <Field label="RL">
            <NumberInput
              value={rl}
              onChange={(e) => setRl(e.target.value)}
              step="any"
            />
          </Field>
          <Field label="RR">
            <NumberInput
              value={rr}
              onChange={(e) => setRr(e.target.value)}
              step="any"
            />
          </Field>
        </div>
      </fieldset>

      <Field label="Weight in car (kg)" hint="Passengers + cargo">
        <NumberInput
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          step="any"
        />
      </Field>
      <Field label="Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Map, mods on the day, traffic, mood…"
        />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? "Saving…" : initial ? "Save changes" : "Log pull"}
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
