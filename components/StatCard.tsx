import { clsx } from "clsx";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-surface p-5 transition-colors",
        accent && "border-accent/40",
      )}
    >
      <div className="text-xs font-medium uppercase tracking-widest text-fg-muted">
        {label}
      </div>
      <div
        className={clsx(
          "num mt-2 text-3xl font-semibold tracking-tight",
          accent ? "text-accent" : "text-fg",
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="num mt-1 text-xs text-fg-dim">{sub}</div>
      )}
    </div>
  );
}
