export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/PageHeader";
import { FluidsClient } from "@/components/FluidsClient";
import { fetchFluids } from "@/lib/fetch-data";

export default async function FluidsPage() {
  const fluids = await fetchFluids();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fluids & consumables"
        subtitle="What's on the shelf, what's running low, what's about to expire."
      />
      <FluidsClient fluids={fluids} />
    </div>
  );
}
