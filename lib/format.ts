export function formatOMR(amount: number | null | undefined): string {
  const v = Number(amount) || 0;
  return `${v.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} OMR`;
}

export function formatKm(km: number | null | undefined): string {
  const v = Number(km) || 0;
  return `${v.toLocaleString("en-US")} km`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSeconds(s: number | null | undefined): string {
  if (s == null) return "—";
  return `${Number(s).toFixed(2)}s`;
}
