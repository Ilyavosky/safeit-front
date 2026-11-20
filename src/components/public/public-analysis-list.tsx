"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/common/error-notice";
import { PublicAnalysisStatus } from "@/components/public/public-analysis-status";
import { useApi } from "@/hooks/use-api";
import { ROUTES } from "@/constants/routes";
import { listPublicAnalyses } from "@/lib/api/public-analyses";
import { formatDateTime } from "@/lib/utils/format-date";

export function PublicAnalysisList() {
  const { data, error, reload } = useApi(listPublicAnalyses);

  return (
    <section aria-labelledby="historial-titulo" className="space-y-3">
      <h2 id="historial-titulo" className="text-[15px] font-semibold">
        Tus análisis recientes
      </h2>
      <ErrorNotice error={error} onRetry={reload} />
      <Card className="rounded-2xl border-[#2a2e35]">
        {data === undefined && !error && (
          <ul aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 first:border-t-0">
                <Skeleton className="w-40" />
                <Skeleton className="ml-auto w-24" />
              </li>
            ))}
          </ul>
        )}
        {data && data.length === 0 && (
          <p className="px-[22px] py-10 text-center text-sm text-muted">Todavía no has analizado ningún dominio.</p>
        )}
        {data && data.length > 0 && (
          <ul>
            {data.map((item) => {
              const hosts = typeof item.stats.total_hosts === "number" ? item.stats.total_hosts : undefined;
              return (
                <li key={item.id} className="border-t border-[#24282e] first:border-t-0">
                  <Link
                    href={ROUTES.publicAnalysisDetail(item.id)}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-[22px] py-3.5 hover:bg-[#20242a]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{item.domain}</span>
                    {hosts !== undefined && <span className="text-[13px] text-muted">{hosts} hosts</span>}
                    <span className="text-[13px] text-muted">{formatDateTime(item.created_at)}</span>
                    <PublicAnalysisStatus status={item.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </section>
  );
}
