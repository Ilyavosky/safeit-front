"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/common/error-notice";
import { SeverityBar } from "@/components/findings/severity-badge";
import { ROUTES } from "@/constants/routes";
import { useApi } from "@/hooks/use-api";
import { listReports } from "@/lib/api/reports";
import { toCounts } from "@/lib/api/mappers";
import { formatDateTime } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";

const COLS = "grid-cols-[minmax(0,1fr)_190px_minmax(150px,220px)_130px_24px]";

export function ReportsListView() {
  const { data, error, reload } = useApi(listReports);

  return (
    <>
      <ErrorNotice error={error} onRetry={reload} />
      <Card className="rounded-2xl border-[#2a2e35]">
        <div className={cn("hidden gap-4 px-[22px] py-3 text-[12.5px] font-medium text-[#80878f] lg:grid", COLS)}>
          <span>Dominio</span>
          <span>Fecha</span>
          <span>Hallazgos</span>
          <span>Redacción</span>
          <span />
        </div>

        {data === undefined && !error && (
          <ul aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className={cn("flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 lg:grid", COLS)}>
                <Skeleton className="w-44" />
                <Skeleton className="hidden w-32 lg:block" />
                <Skeleton className="hidden w-full lg:block" />
                <Skeleton className="hidden w-20 lg:block" />
                <span />
              </li>
            ))}
          </ul>
        )}

        {data && data.length === 0 && (
          <div className="border-t border-[#24282e] px-[22px] py-14 text-center">
            <p className="font-semibold">Aún no hay reportes</p>
            <p className="mx-auto mt-1 max-w-[44ch] text-sm text-muted">
              Se genera automáticamente cuando termina un escaneo de pruebas.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <ul>
            {data.map((r) => (
              <li key={r.scan_id} className="border-t border-[#24282e]">
                <Link href={ROUTES.report(r.scan_id)} className={cn("flex items-center gap-4 px-[22px] py-3.5 hover:bg-[#20242a] lg:grid", COLS)}>
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{r.domain}</span>
                  <span className="hidden text-[13.5px] text-muted lg:block">{formatDateTime(r.created_at) ?? "—"}</span>
                  <span className="hidden items-center gap-2.5 lg:flex">
                    <SeverityBar counts={toCounts(r.severity_counts)} className="flex-1" />
                    <span className="w-6 text-right font-semibold tabular-nums">{r.total_findings}</span>
                  </span>
                  <span className="hidden lg:block">
                    {r.generated_with_llm ? (
                      <Badge className="bg-[#1e2c3d] text-[#93bdf0]">Con IA</Badge>
                    ) : (
                      <Badge className="bg-[#2a2e35] text-[#b4bac2]">Automática</Badge>
                    )}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="hidden text-[#80878f] lg:block" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
