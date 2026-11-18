import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScanMeta } from "@/types";

function Meta({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[12.5px] font-medium text-[#80878f]">{label}</p>
      <div className="mt-1 flex min-h-[22px] items-center text-[15px] font-semibold">
        {value !== undefined ? <span className="truncate">{value}</span> : <Skeleton className="w-24" />}
      </div>
    </div>
  );
}

export function ExecutiveSummary({ meta, summary }: { meta?: ScanMeta; summary?: string[] }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-[#24282e] px-6 py-5 md:grid-cols-4">
        <Meta label="Dominio" value={meta?.domain} />
        <Meta label="Fecha del escaneo" value={meta?.date} />
        <Meta label="Duración" value={meta?.duration} />
        <Meta label="Activos analizados" value={meta?.assets} />
      </div>
      <div className="px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Resumen ejecutivo</h2>
          <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[#232b45] px-2.5 text-[12.5px] font-semibold text-[#a9bbff]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            </svg>
            Redactado por IA
          </span>
        </div>
        <div className="mt-3 space-y-3 text-[14.5px] leading-relaxed text-[#d5d9de]">
          {summary ? (
            summary.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <div className="space-y-2.5 pt-1" aria-hidden="true">
              <Skeleton className="w-full" />
              <Skeleton className="w-11/12" />
              <Skeleton className="w-full" />
              <Skeleton className="w-3/5" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}