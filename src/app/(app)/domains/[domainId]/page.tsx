import type { Metadata } from "next";
import { DomainDetailView } from "@/components/domains/domain-detail-view";

export const metadata: Metadata = { title: "Detalle del dominio" };

export default async function DomainDetailPage({ params }: { params: Promise<{ domainId: string }> }) {
  const { domainId } = await params;
  return <DomainDetailView domainId={domainId} />;
}
