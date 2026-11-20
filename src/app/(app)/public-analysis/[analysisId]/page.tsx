import type { Metadata } from "next";
import { PublicAnalysisDetail } from "@/components/public/public-analysis-detail";

export const metadata: Metadata = { title: "Detalle del análisis público" };

export default async function PublicAnalysisDetailPage({ params }: { params: Promise<{ analysisId: string }> }) {
  const { analysisId } = await params;
  return <PublicAnalysisDetail analysisId={analysisId} />;
}
