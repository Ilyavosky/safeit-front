import type { Metadata } from "next";
import { AssetView } from "@/components/assets/asset-view";

export const metadata: Metadata = { title: "Detalle del activo" };

export default async function AssetDetailPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  return <AssetView assetId={assetId} />;
}
