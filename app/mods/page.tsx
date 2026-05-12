export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/PageHeader";
import { ModsClient } from "@/components/ModsClient";
import { fetchMods } from "@/lib/fetch-data";

export default async function ModsPage() {
  const mods = await fetchMods();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mods"
        subtitle="Bolt-ons, tune flashes, brake upgrades — what's bolted to the car and when."
      />
      <ModsClient mods={mods} />
    </div>
  );
}
