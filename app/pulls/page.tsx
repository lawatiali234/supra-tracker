export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/PageHeader";
import { PullsClient } from "@/components/PullsClient";
import { fetchPulls } from "@/lib/fetch-data";

export default async function PullsPage() {
  const pulls = await fetchPulls();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pulls"
        subtitle="50–100, 80–160, 100–200 km/h. Track how times move with weather, weight, and mods."
      />
      <PullsClient pulls={pulls} />
    </div>
  );
}
