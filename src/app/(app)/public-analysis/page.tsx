import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PublicAnalysisView } from "@/components/public/public-analysis-view";

export const metadata: Metadata = { title: "Análisis público" };

export default function PublicAnalysisPage() {
  return (
    <>
      <PageHeader
        title="Análisis público"
        description="Conoce qué hay detrás de un dominio, sea tuyo o de un tercero: sus subdominios y qué tipo de contenido tiene cada uno."
      />
      <PublicAnalysisView />
    </>
  );
}
