export const dynamic = "force-dynamic";

import { StatCard } from "@/components/StatCard";
import { OilGauge } from "@/components/OilGauge";
import { MileageQuickForm } from "@/components/forms/MileageQuickForm";
import { DataTable, type Column } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { ChevronRight, Gauge } from "lucide-react";
import {
  fetchMileageLog,
  fetchMods,
  fetchProfile,
  fetchService,
} from "@/lib/fetch-data";
import {
  mileageProjection,
  nextServiceDue,
  oilStatus,
  sumCosts,
} from "@/lib/predictions";
import { formatDate, formatKm, formatOMR } from "@/lib/format";
import {
  SERVICE_TYPE_LABELS,
  type ServiceEntry,
  type ServiceType,
} from "@/lib/types";

const NEXT_DUE_TYPES: ServiceType[] = [
  "oil",
  "brake_fluid",
  "spark_plugs",
  "coolant",
];

export default async function DashboardPage() {
  const [profile, service, mods, mileageLog] = await Promise.all([
    fetchProfile(),
    fetchService(),
    fetchMods(),
    fetchMileageLog(),
  ]);

  const oil = oilStatus(service, profile);
  const projection = mileageProjection(mileageLog);
  const totalMods = sumCosts(mods);
  const totalService = sumCosts(service);
  const recent = service.slice(0, 5);

  const columns: Column<ServiceEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (r) => <span className="num">{formatDate(r.date)}</span>,
    },
    {
      key: "mileage",
      header: "Mileage",
      align: "right",
      render: (r) => <span className="num">{formatKm(r.mileage)}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (r) => SERVICE_TYPE_LABELS[r.type] ?? r.type,
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      render: (r) => <span className="num">{formatOMR(r.cost)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-fg-dim">
            {profile.plate ? `${profile.plate} · ` : ""}MkV Supra at a glance
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Current mileage"
          value={profile.currentMileage > 0 ? formatKm(profile.currentMileage) : "—"}
          sub={
            projection.hasData
              ? `~${Math.round(projection.kmPerMonth ?? 0).toLocaleString()} km / month`
              : "Log mileage to project usage"
          }
          accent
        />
        <StatCard
          label="Mods spend"
          value={formatOMR(totalMods)}
          sub={`${mods.length} ${mods.length === 1 ? "mod" : "mods"}`}
        />
        <StatCard
          label="Maintenance spend"
          value={formatOMR(totalService)}
          sub={`${service.length} ${service.length === 1 ? "entry" : "entries"}`}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <OilGauge
          percentUsed={oil.percentUsed}
          kmRemaining={oil.kmUntilDue}
          intervalKm={oil.intervalKm}
          lastOilMileage={oil.lastOilMileage}
          hasData={oil.hasData}
        />

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-xs font-medium uppercase tracking-widest text-fg-muted">
            Log mileage
          </h3>
          <p className="mt-1 text-xs text-fg-dim">
            Drop in your current odo reading.
          </p>
          <div className="mt-4">
            <MileageQuickForm />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-fg-muted">
          Next service due
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NEXT_DUE_TYPES.map((t) => {
            const d = nextServiceDue(service, profile, t);
            return (
              <div
                key={t}
                className="rounded-lg border border-border bg-bg p-3"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-fg-muted">
                  {SERVICE_TYPE_LABELS[t]}
                </div>
                {d.hasData ? (
                  <>
                    <div
                      className={`num mt-1 text-lg font-semibold ${
                        (d.kmUntilDue ?? 0) < 0
                          ? "text-danger"
                          : (d.kmUntilDue ?? 0) < 1000
                            ? "text-warning"
                            : "text-fg"
                      }`}
                    >
                      {(d.kmUntilDue ?? 0) >= 0
                        ? `in ${formatKm(d.kmUntilDue ?? 0)}`
                        : `${formatKm(-(d.kmUntilDue ?? 0))} overdue`}
                    </div>
                    <div className="num mt-0.5 text-[11px] text-fg-muted">
                      at {formatKm(d.nextDueMileage ?? 0)}
                    </div>
                  </>
                ) : (
                  <div className="mt-1 text-xs text-fg-muted">
                    Log a {SERVICE_TYPE_LABELS[t].toLowerCase()} to predict.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-xs font-medium uppercase tracking-widest text-fg-muted">
            Recent service
          </h3>
          <Link
            href="/service"
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <DataTable
          columns={columns}
          rows={recent}
          rowKey={(r) => r.id}
          empty={
            <EmptyState
              icon={<Gauge className="h-7 w-7" />}
              title="No service logged yet"
              description="Add an oil change, plug swap, or brake fluid flush from the Service page to unlock predictions."
            />
          }
        />
      </section>
    </div>
  );
}
