import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RescanButton } from "@/components/assets/rescan-button";
import { ServicesTable } from "@/components/assets/services-table";
import { AssetSummary } from "@/components/assets/asset-summary";
import { RecentFindings } from "@/components/dashboard/recent-findings";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Detalle del activo" };

export default function AssetDetailPage() {
  return (
    <>
      <PageHeader
        title={<Skeleton className="mt-2 h-5 w-64 max-w-full" />}
        breadcrumb={[{ label: "Dominios", href: ROUTES.domains }, { label: "Activo" }]}
        actions={<RescanButton />}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <ServicesTable />
          <RecentFindings />
        </div>
        <AssetSummary />
      </div>
    </>
  );
}