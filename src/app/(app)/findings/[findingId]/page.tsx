import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LlmExplanation } from "@/components/findings/llm-explanation";
import { CvePanel } from "@/components/findings/cve-panel";
import { StatusStepper } from "@/components/findings/status-stepper";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Detalle del hallazgo" };

export default function FindingDetailPage() {
  return (
    <>
      <PageHeader
        title={<Skeleton className="mt-2 h-5 w-80 max-w-full" />}
        breadcrumb={[{ label: "Hallazgos", href: ROUTES.findings }, { label: "Detalle" }]}
        badges={
          <>
            <span className="h-[26px] w-16 rounded-full bg-line" />
            <span className="h-[26px] w-24 rounded-full bg-line" />
          </>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <LlmExplanation />
          <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
            <h2 className="text-base font-semibold">Evidencia</h2>
            <p className="mt-0.5 text-[13px] text-[#80878f]">Lo que respondió el servidor cuando el escáner lo detectó.</p>
            <div className="mt-4 space-y-2.5 rounded-xl border border-line bg-field px-4 py-4" aria-hidden="true">
              <Skeleton className="w-3/5" />
              <Skeleton className="w-4/5" />
              <Skeleton className="w-2/5" />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-5">
          <CvePanel />
          <StatusStepper />
        </div>
      </div>
    </>
  );
}