"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clsx } from "clsx";
import type { Pull } from "@/lib/types";

const SERIES = [
  { key: "t50", label: "50–100", color: "#f97316" },
  { key: "t80", label: "80–160", color: "#22c55e" },
  { key: "t100", label: "100–200", color: "#eab308" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

interface Row {
  date: string;
  t50: number | null;
  t80: number | null;
  t100: number | null;
}

export function PullsTimelineChart({ pulls }: { pulls: Pull[] }) {
  const [enabled, setEnabled] = useState<Record<SeriesKey, boolean>>({
    t50: true,
    t80: true,
    t100: true,
  });

  const data = useMemo<Row[]>(
    () =>
      [...pulls]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((p) => ({
          date: p.date,
          t50: p.time50to100 ?? null,
          t80: p.time80to160 ?? null,
          t100: p.time100to200 ?? null,
        })),
    [pulls],
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-medium uppercase tracking-widest text-fg-muted">
          Times over time
        </h3>
        <div className="flex gap-1">
          {SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() =>
                setEnabled((p) => ({ ...p, [s.key]: !p[s.key] }))
              }
              className={clsx(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-colors",
                enabled[s.key]
                  ? "border-border bg-surface-2 text-fg"
                  : "border-border bg-bg text-fg-muted",
              )}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: enabled[s.key] ? s.color : "var(--color-border-strong)",
                }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#262626" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#262626" }}
              label={{
                value: "seconds",
                angle: -90,
                position: "insideLeft",
                fill: "#71717a",
                fontSize: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#0a0a0a",
                border: "1px solid #262626",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            {SERIES.map((s) =>
              enabled[s.key] ? (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: s.color }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
