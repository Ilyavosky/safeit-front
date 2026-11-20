"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/common/error-notice";
import { CvePanel } from "@/components/findings/cve-panel";
import { SeverityBadge } from "@/components/findings/severity-badge";
import { StatusBadge } from "@/components/findings/status-badge";
import { StatusStepper } from "@/components/findings/status-stepper";
import { ROUTES } from "@/constants/routes";
import { useApi } from "@/hooks/use-api";
import { useCveInfo } from "@/hooks/use-findings";
import { getFinding, updateFindingStatus } from "@/lib/api/findings";
import { getReport } from "@/lib/api/reports";
import { toFindingDetail, uiStatusToRemediation } from "@/lib/api/mappers";
import type { FindingStatus } from "@/constants/finding-status";
import type { FindingDetailResponse } from "@/lib/api/types";

export function FindingDetailView({ findingId }: { findingId: string }) {
  const finding = useApi(() => getFinding(findingId), [findingId]);
  const [override, setOverride] = useState<FindingDetailResponse>();
  const current = override ?? finding.data;
  const cve = useCveInfo([current?.cve_ids[0]]);
  const report = useApi(current ? () => getReport(current.scan_id).catch(() => null) : null, [current?.scan_id]);
  const recommendation = report.data?.recommendations.find((r) => r.finding_id === findingId);
  const detail = current ? toFindingDetail(current, cve[current.cve_ids[0]]) : undefined;

  async function save(status: FindingStatus, reason?: string) {
    const updated = await updateFindingStatus(findingId, uiStatusToRemediation(status), reason);
    setOverride(updated);
  }

  return (
    <>
      <PageHeader
        title={current ? current.title : <Skeleton className="mt-2 h-5 w-80 max-w-full" />}
        breadcrumb={[{ label: "Hallazgos", href: ROUTES.findings }, { label: "Detalle" }]}
        badges={
          detail ? (
            <>
              <SeverityBadge severity={detail.severity} />
              <StatusBadge status={detail.status} />
            </>
          ) : (
            <>
              <span className="h-[26px] w-16 rounded-full bg-line" />
              <span className="h-[26px] w-24 rounded-full bg-line" />
            </>
          )
        }
      />
      <ErrorNotice error={finding.error} onRetry={finding.reload} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Cómo corregirlo</h2>
              {report.data?.generated_with_llm && (
                <span className="inline-flex h-[26px] items-center rounded-full bg-[#232b45] px-2.5 text-[12.5px] font-semibold text-[#a9bbff]">
                  Recomendación generada por IA
                </span>
              )}
            </div>
            <div className="mt-4 text-[14.5px] leading-relaxed text-[#d5d9de]">
              {report.loading || !current ? (
                <div className="space-y-2.5" aria-hidden="true">
                  <Skeleton className="w-full" />
                  <Skeleton className="w-3/4" />
                </div>
              ) : recommendation ? (
                <p>{recommendation.action}</p>
              ) : (
                <p className="text-muted">Todavía no hay una recomendación para este hallazgo. Aparecerá cuando termine el reporte del escaneo.</p>
              )}
            </div>
          </Card>
          <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
            <h2 className="text-base font-semibold">Dónde se detectó</h2>
            <p className="mt-0.5 text-[13px] text-[#80878f]">La evidencia completa se guarda cifrada y no se muestra en pantalla.</p>
            <div className="mt-4 space-y-1.5 rounded-xl border border-line bg-field px-4 py-4 text-[13.5px]">
              {current ? (
                <>
                  <p className="break-all font-mono">{current.url}</p>
                  <p className="text-muted">
                    {current.domain} · {current.asset}
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="w-3/5" />
                  <Skeleton className="w-2/5" />
                </>
              )}
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-5">
          <CvePanel finding={detail} />
          <StatusStepper key={detail?.status} status={detail?.status} onSave={detail ? save : undefined} />
        </div>
      </div>
    </>
  );
}
