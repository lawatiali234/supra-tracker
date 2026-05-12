import { clsx } from "clsx";

type Variant = "open" | "monitoring" | "resolved" | "low" | "warn" | "ok" | "neutral";

const STYLES: Record<Variant, string> = {
  open: "bg-danger/10 text-danger border-danger/30",
  monitoring: "bg-warning/10 text-warning border-warning/30",
  resolved: "bg-success/10 text-success border-success/30",
  low: "bg-danger/10 text-danger border-danger/30",
  warn: "bg-warning/10 text-warning border-warning/30",
  ok: "bg-success/10 text-success border-success/30",
  neutral: "bg-surface-2 text-fg-dim border-border",
};

export function StatusBadge({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        STYLES[variant],
      )}
    >
      {children}
    </span>
  );
}
