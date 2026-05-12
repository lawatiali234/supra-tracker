import { formatKm } from "@/lib/format";

interface OilGaugeProps {
  percentUsed: number; // 0..1
  kmRemaining?: number;
  intervalKm: number;
  lastOilMileage?: number;
  hasData: boolean;
}

export function OilGauge({
  percentUsed,
  kmRemaining,
  intervalKm,
  lastOilMileage,
  hasData,
}: OilGaugeProps) {
  // Arc geometry — 180° half-donut
  const cx = 100;
  const cy = 100;
  const r = 80;
  const startAngle = Math.PI; // 180°
  const endAngle = 2 * Math.PI; // 360°
  const sweep = endAngle - startAngle;

  // Pointer angle based on percent
  const pct = Math.min(1, Math.max(0, percentUsed));
  const pointerAngle = startAngle + sweep * pct;
  const px = cx + r * Math.cos(pointerAngle);
  const py = cy + r * Math.sin(pointerAngle);

  // Pre-compute arc paths for color zones (green/orange/red)
  const arc = (from: number, to: number) => {
    const a0 = startAngle + sweep * from;
    const a1 = startAngle + sweep * to;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const largeArc = to - from > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`;
  };

  const percentLabel = hasData ? `${Math.round(pct * 100)}%` : "—";
  const kmRemainingLabel =
    hasData && kmRemaining != null
      ? kmRemaining >= 0
        ? `${formatKm(kmRemaining)} until next oil`
        : `${formatKm(-kmRemaining)} overdue`
      : "Log an oil service to enable tracking";

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium uppercase tracking-widest text-fg-muted">
          Oil Life
        </h3>
        <span className="num text-xs text-fg-dim">
          {hasData ? `${formatKm(intervalKm)} interval` : ""}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="h-40 w-full max-w-xs">
          {/* Track */}
          <path
            d={arc(0, 1)}
            stroke="var(--color-surface-2)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Zones */}
          <path d={arc(0, 0.6)} stroke="var(--color-success)" strokeWidth="14" strokeLinecap="butt" fill="none" opacity={hasData ? 0.85 : 0.2} />
          <path d={arc(0.6, 0.85)} stroke="var(--color-warning)" strokeWidth="14" strokeLinecap="butt" fill="none" opacity={hasData ? 0.85 : 0.2} />
          <path d={arc(0.85, 1)} stroke="var(--color-danger)" strokeWidth="14" strokeLinecap="butt" fill="none" opacity={hasData ? 0.85 : 0.2} />
          {/* Pointer */}
          {hasData && (
            <>
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={py}
                stroke="var(--color-fg)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx={cx} cy={cy} r="6" fill="var(--color-fg)" />
              <circle cx={cx} cy={cy} r="3" fill="var(--color-bg)" />
            </>
          )}
          {/* Center label */}
          <text
            x={cx}
            y={cy - 16}
            textAnchor="middle"
            className="num"
            fill="var(--color-fg)"
            fontSize="22"
            fontWeight="600"
          >
            {percentLabel}
          </text>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fill="var(--color-fg-muted)"
            fontSize="9"
          >
            USED
          </text>
        </svg>
      </div>

      <div className="mt-2 text-center text-sm text-fg-dim">
        {kmRemainingLabel}
      </div>
      {hasData && lastOilMileage != null && (
        <div className="num mt-1 text-center text-xs text-fg-muted">
          Last oil @ {formatKm(lastOilMileage)}
        </div>
      )}
    </div>
  );
}
