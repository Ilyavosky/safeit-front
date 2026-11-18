import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DownloadPdfButton } from "@/components/reports/download-pdf-button";
import { ExecutiveSummary } from "@/components/reports/executive-summary";
import { SeverityChart } from "@/components/reports/severity-chart";
import { RecommendationsList } from "@/components/reports/recommendations-list";

export const metadata: Metadata = { title: "Reporte" };

export default function ReportPage() {
  return (
    <>
      <PageHeader
        title="Reporte del escaneo"
        description="Resumen para compartir con tu equipo o con quien tome decisiones."
        actions={<DownloadPdfButton />}
      />
      <ExecutiveSummary />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <RecommendationsList />
        <SeverityChart />
      </div>
    </>
  );
}