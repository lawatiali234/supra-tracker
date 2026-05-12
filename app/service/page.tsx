export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/PageHeader";
import { ServiceClient } from "@/components/ServiceClient";
import { fetchProfile, fetchService } from "@/lib/fetch-data";
import { nextServiceDue } from "@/lib/predictions";
import { formatKm } from "@/lib/format";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/lib/types";

const TYPES: ServiceType[] = [
  "oil",
  "brake_fluid",
  "spark_plugs",
  "coolant",
  "inspection",
];

export default async function ServicePage() {
  const [service, profile] = await Promise.all([
    fetchService(),
    fetchProfile(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service history"
        subtitle="Every oil, fluid, and consumable swap, chronologically."
      />

      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-muted">
          Next due
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TYPES.map((t) => {
            const d = nextServiceDue(service, profile, t);
            const overdue = (d.kmUntilDue ?? 0) < 0;
            const soon = (d.kmUntilDue ?? 0) >= 0 && (d.kmUntilDue ?? 0) < 1000;
            return (
              <div
                key={t}
                className="rounded-lg border border-border bg-bg p-3"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
                  {SERVICE_TYPE_LABELS[t]}
                </div>
                {d.hasData ? (
                  <div
                    className={`num mt-1 text-base font-semibold ${
                      overdue
                        ? "text-danger"
                        : soon
                          ? "text-warning"
                          : "text-fg"
                    }`}
                  >
                    {overdue
                      ? `${formatKm(-(d.kmUntilDue ?? 0))} overdue`
                      : `in ${formatKm(d.kmUntilDue ?? 0)}`}
                  </div>
                ) : (
                  <div className="mt-1 text-[11px] text-fg-muted">
                    No history
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ServiceClient service={service} />
    </div>
  );
}
