"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ErrorNotice } from "@/components/common/error-notice";
import { DownloadPdfButton } from "@/components/reports/download-pdf-button";
import { ExecutiveSummary } from "@/components/reports/executive-summary";
import { SeverityChart } from "@/components/reports/severity-chart";
import { RecommendationsList } from "@/components/reports/recommendations-list";
import { useApi } from "@/hooks/use-api";
import { getDashboard, listFindings } from "@/lib/api/findings";
import { downloadReportPdf, getLatestReport, getReport, updateRecommendation } from "@/lib/api/reports";
import { getScan } from "@/lib/api/scans";
import { lifecycleToUi, toCounts, toRecommendation } from "@/lib/api/mappers";
import { ROUTES } from "@/constants/routes";
import { FINDING_STATUSES, type FindingStatus } from "@/constants/finding-status";
import { formatDate, formatDuration } from "@/lib/utils/format-date";
import type { RecommendationStatus } from "@/lib/api/types";

async function statusCounts(scanId: string) {
  const counts = Object.fromEntries(FINDING_STATUSES.map((s) => [s, 0])) as Record<FindingStatus, number>;
  let cursor: string | undefined;
  for (let i = 0; i < 5; i++) {
    const page = await listFindings({ scan_id: scanId, limit: 100, cursor });
    for (const f of page.items) counts[lifecycleToUi(f.status)]++;
    if (!page.next_cursor) break;
    cursor = page.next_cursor;
  }
  return counts;
}

async function load(param: string) {
  const scanId = param === "ultimo" ? (await getLatestReport()).scan_id : param;
  if (!scanId) return null;
  const [report, scan, dash, statuses] = await Promise.all([
    getReport(scanId),
    getScan(scanId),
    getDashboard({ scan_id: scanId }),
    statusCounts(scanId),
  ]);
  return { scanId, report, scan, assets: dash.assets, statuses };
}

export function ReportView({ scanParam }: { scanParam: string }) {
  const { data, error, loading, reload } = useApi(() => load(scanParam), [scanParam]);
  const [overrides, setOverrides] = useState<Record<string, RecommendationStatus>>({});
  const [pdfError, setPdfError] = useState<string>();

  const items = data?.report.recommendations.map((r) => {
    const rec = toRecommendation(r);
    return { ...rec, status: overrides[r.id] ?? rec.status };
  });

  async function toggle(id: string, status: RecommendationStatus) {
    setOverrides((o) => ({ ...o, [id]: status }));
    try {
      await updateRecommendation(id, status);
    } catch {
      setOverrides((o) => {
        const rest = { ...o };
        delete rest[id];
        return rest;
      });
    }
  }

  const empty = !loading && !error && data === null;

  return (
    <>
      <PageHeader
        title="Reporte del escaneo"
        breadcrumb={[{ label: "Reportes", href: ROUTES.reports }, { label: "Detalle" }]}
        description="Resumen para compartir con tu equipo o con quien tome decisiones."
        actions={
          <DownloadPdfButton
            onDownload={
              data
                ? async () => {
                    setPdfError(undefined);
                    try {
                      await downloadReportPdf(data.scanId);
                    } catch (e) {
                      setPdfError(e instanceof Error ? e.message : "No pudimos descargar el PDF.");
                    }
                  }
                : undefined
            }
          />
        }
      />
      <ErrorNotice error={error} onRetry={reload} />
      {pdfError && <p className="text-[13px] text-[#ff8f8f]">{pdfError}</p>}
      {empty ? (
        <Card className="rounded-2xl border-[#2a2e35] px-6 py-14 text-center">
          <p className="font-semibold">Aún no hay reportes</p>
          <p className="mx-auto mt-1 max-w-[44ch] text-sm text-muted">Se genera automáticamente cuando termina un escaneo de pruebas.</p>
        </Card>
      ) : (
        <>
          <ExecutiveSummary
            meta={
              data
                ? {
                    domain: data.report.domain,
                    date: formatDate(data.report.created_at) ?? "—",
                    duration: formatDuration(data.scan.started_at, data.scan.finished_at) ?? "—",
                    assets: data.assets,
                  }
                : undefined
            }
            summary={data?.report.summary.split(/\n{2,}/).filter(Boolean)}
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
            <RecommendationsList items={items} onStatusChange={data ? toggle : undefined} />
            <SeverityChart severities={data ? toCounts(data.report.severity_counts) : undefined} statuses={data?.statuses} />
          </div>
        </>
      )}
    </>
  );
}
