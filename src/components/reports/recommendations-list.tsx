import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/findings/severity-badge";
import type { Recommendation } from "@/types";

export function RecommendationsList({ items }: { items?: Recommendation[] }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="px-6 pb-3 pt-5">
        <h2 className="text-base font-semibold">Recomendaciones</h2>
        <p className="mt-0.5 text-[13px] text-[#80878f]">En el orden en que conviene atenderlas.</p>
      </div>

      {items === undefined && (
        <ol aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex gap-4 border-t border-[#24282e] px-6 py-4">
              <span className="grid size-7 flex-none place-items-center rounded-full bg-[#23272e] text-[13px] font-semibold text-muted">{i + 1}</span>
              <div className="flex-1 space-y-2.5 pt-1.5">
                <Skeleton className="w-1/2" />
                <Skeleton className="w-5/6" />
              </div>
            </li>
          ))}
        </ol>
      )}

      {items && items.length === 0 && (
        <p className="border-t border-[#24282e] px-6 py-10 text-center text-sm text-muted">No hay recomendaciones para este escaneo.</p>
      )}

      {items && items.length > 0 && (
        <ol>
          {items.map((r, i) => (
            <li key={r.id} className="flex gap-4 border-t border-[#24282e] px-6 py-4">
              <span className="grid size-7 flex-none place-items-center rounded-full bg-[#23272e] text-[13px] font-semibold text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="font-semibold">{r.title}</p>
                  <SeverityBadge severity={r.severity} />
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{r.detail}</p>
                <p className="mt-1.5 text-[13px] text-[#80878f]">
                  Resuelve {r.findings} {r.findings === 1 ? "hallazgo" : "hallazgos"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}