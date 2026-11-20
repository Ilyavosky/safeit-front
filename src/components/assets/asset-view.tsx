"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/common/error-notice";
import { RescanButton } from "@/components/assets/rescan-button";
import { ServicesTable } from "@/components/assets/services-table";
import { AssetSummary } from "@/components/assets/asset-summary";
import { EndpointsCard } from "@/components/assets/endpoints-card";
import { RecentFindings } from "@/components/dashboard/recent-findings";
import { ROUTES } from "@/constants/routes";
import { useApi } from "@/hooks/use-api";
import { useCveInfo } from "@/hooks/use-findings";
import { useScanStatus } from "@/hooks/use-scan-status";
import { ApiError } from "@/lib/api/client";
import { getAsset, rescanAsset } from "@/lib/api/assets";
import { getDomain } from "@/lib/api/domains";
import { listFindings } from "@/lib/api/findings";
import { isScanActive, toAssetDetail, toPriorityFinding, toServices } from "@/lib/api/mappers";

export function AssetView({ assetId }: { assetId: string }) {
  const asset = useApi(() => getAsset(assetId), [assetId]);
  const domain = useApi(asset.data ? () => getDomain(asset.data!.domain_id) : null, [asset.data?.domain_id]);
  const findings = useApi(() => listFindings({ asset_id: assetId, sort: "priority", limit: 5 }), [assetId]);
  const cve = useCveInfo(findings.data?.items.map((f) => f.cve_ids[0]) ?? []);

  const [scanId, setScanId] = useState<string>();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string>();
  const scan = useScanStatus(scanId, () => {
    asset.reload();
    findings.reload();
  });
  const scanning = starting || isScanActive(scan);

  async function rescan() {
    setStarting(true);
    setError(undefined);
    try {
      setScanId((await rescanAsset(assetId)).id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos iniciar el escaneo.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={asset.data ? <span className="font-mono text-[22px]">{asset.data.value}</span> : <Skeleton className="mt-2 h-5 w-64 max-w-full" />}
        breadcrumb={[
          { label: "Dominios", href: ROUTES.domains },
          ...(asset.data ? [{ label: domain.data?.name ?? "Dominio", href: ROUTES.domain(asset.data.domain_id) }] : []),
          { label: "Activo" },
        ]}
        actions={<RescanButton scanning={scanning} onClick={rescan} />}
      />
      <ErrorNotice error={asset.error} onRetry={asset.reload} />
      {error && <p role="alert" className="text-[13px] text-[#ff8f8f]">{error}</p>}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <ServicesTable services={asset.data ? toServices(asset.data) : undefined} />
          <EndpointsCard endpoints={asset.data?.endpoints} />
          <RecentFindings findings={findings.data?.items.map((f) => toPriorityFinding(f, cve[f.cve_ids[0]]))} />
        </div>
        <AssetSummary asset={asset.data && domain.data ? toAssetDetail(asset.data, domain.data.name) : undefined} />
      </div>
    </>
  );
}
