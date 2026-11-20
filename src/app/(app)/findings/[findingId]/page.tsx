import type { Metadata } from "next";
import { FindingDetailView } from "@/components/findings/finding-detail-view";

export const metadata: Metadata = { title: "Detalle del hallazgo" };

export default async function FindingDetailPage({ params }: { params: Promise<{ findingId: string }> }) {
  const { findingId } = await params;
  return <FindingDetailView findingId={findingId} />;
}
