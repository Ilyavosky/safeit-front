import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DomainOverview, DomainSeverity } from "@/components/domains/domain-overview";
import { DomainAssets } from "@/components/domains/domain-assets";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Detalle del dominio" };

export default function DomainDetailPage() {
  return (
    <>
      <PageHeader
        title={<Skeleton className="mt-2 h-5 w-56" />}
        breadcrumb={[{ label: "Dominios", href: ROUTES.domains }, { label: "Detalle" }]}
        actions={
          <>
            <Link href={ROUTES.findings} className={buttonClasses("secondary", "h-[42px]")}>
              Ver hallazgos
            </Link>
            <Button className="h-[42px]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 12a8 8 0 11-2.3-5.6" />
                <path d="M20 4v4.5h-4.5" />
              </svg>
              Escanear ahora
            </Button>
          </>
        }
      />
      <DomainOverview />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DomainAssets />
        <DomainSeverity />
      </div>
    </>
  );
}