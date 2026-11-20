import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FindingsView } from "@/components/findings/findings-view";

export const metadata: Metadata = { title: "Hallazgos" };

export default function FindingsPage() {
  return (
    <>
      <PageHeader
        title="Hallazgos"
        description="Vulnerabilidades encontradas en tus dominios. Las que están en CISA KEV van primero."
      />
      <FindingsView />
    </>
  );
}