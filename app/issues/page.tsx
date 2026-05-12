export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/PageHeader";
import { IssuesClient } from "@/components/IssuesClient";
import { fetchIssues } from "@/lib/fetch-data";

export default async function IssuesPage() {
  const issues = await fetchIssues();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Issues"
        subtitle="Open, monitoring, resolved — and the notes trail to remember what you tried."
      />
      <IssuesClient issues={issues} />
    </div>
  );
}
