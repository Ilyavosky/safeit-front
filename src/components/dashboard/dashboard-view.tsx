"use client";

import { ErrorNotice } from "@/components/common/error-notice";
import { SeveritySummary } from "@/components/dashboard/severity-summary";
import { AssetsOverview } from "@/components/dashboard/assets-overview";
import { RecentFindings } from "@/components/dashboard/recent-findings";
import { useApi } from "@/hooks/use-api";
import { useDomainSummaries } from "@/hooks/use-domains";
import { useCveInfo } from "@/hooks/use-findings";
import { getDashboard } from "@/lib/api/findings";
import { dashboardScore, toCounts, toPriorityFinding } from "@/lib/api/mappers";

export function DashboardView() {
  const summary = useApi(() => getDashboard());
  const domains = useDomainSummaries();
  const latest = summary.data?.latest_findings;
  const cve = useCveInfo(latest?.map((f) => f.cve_ids[0]) ?? []);

  return (
    <>
      <ErrorNotice error={summary.error} onRetry={summary.reload} />
      <SeveritySummary
        score={summary.data ? dashboardScore(summary.data) : undefined}
        counts={summary.data ? toCounts(summary.data.severity_counts) : undefined}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AssetsOverview domains={domains.data} />
        <RecentFindings findings={latest?.map((f) => toPriorityFinding(f, cve[f.cve_ids[0]]))} />
      </div>
      <ErrorNotice error={domains.error} onRetry={domains.reload} />
    </>
  );
}
