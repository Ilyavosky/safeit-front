import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { SeveritySummary } from "@/components/dashboard/severity-summary";
import { AssetsOverview } from "@/components/dashboard/assets-overview";
import { RecentFindings } from "@/components/dashboard/recent-findings";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Inicio" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Inicio"
        description="Resumen de tus dominios verificados y de los hallazgos abiertos."
        actions={
          <>
            <Link href={ROUTES.report("ultimo")} className={buttonClasses("secondary", "h-[42px]")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8l-5-5z" />
                <path d="M14 3v5h5" />
              </svg>
              Ver reporte
            </Link>
            <Link href={ROUTES.newDomain} className={buttonClasses("primary", "h-[42px]")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar dominio
            </Link>
          </>
        }
      />
      <SeveritySummary />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AssetsOverview />
        <RecentFindings />
      </div>
    </>
  );
}