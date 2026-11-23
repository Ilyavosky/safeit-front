import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReportsListView } from "@/components/reports/reports-list-view";

export const metadata: Metadata = { title: "Reportes" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reportes" description="Un reporte por cada escaneo de pruebas terminado. Abre uno para ver su detalle." />
      <ReportsListView />
    </>
  );
}
