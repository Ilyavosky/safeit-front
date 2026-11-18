import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FindingExplanation } from "@/types";

function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-2.5 pt-1">
      {widths.map((w, i) => (
        <Skeleton key={i} className={w} />
      ))}
    </div>
  );
}

export function LlmExplanation({ explanation }: { explanation?: FindingExplanation }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Qué significa y cómo corregirlo</h2>
        <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[#232b45] px-2.5 text-[12.5px] font-semibold text-[#a9bbff]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          </svg>
          Explicación generada por IA
        </span>
      </div>

      <div className="mt-5 space-y-6">
        <section>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#80878f]">Qué es</h3>
          <div className="mt-2 text-[14.5px] leading-relaxed text-[#d5d9de]">
            {explanation ? <p>{explanation.summary}</p> : <Lines widths={["w-full", "w-11/12", "w-2/3"]} />}
          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#80878f]">Qué podría pasar</h3>
          <div className="mt-2 text-[14.5px] leading-relaxed text-[#d5d9de]">
            {explanation ? <p>{explanation.impact}</p> : <Lines widths={["w-full", "w-3/4"]} />}
          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#80878f]">Cómo corregirlo</h3>
          <ol className="mt-3 space-y-3">
            {(explanation ? explanation.steps : [null, null, null]).map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 flex-none place-items-center rounded-full bg-[#23272e] text-xs font-semibold text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1 pt-0.5 text-[14.5px] leading-relaxed text-[#d5d9de]">
                  {step ?? <Skeleton className="mt-1.5 w-4/5" />}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <p className="mt-6 border-t border-[#24282e] pt-4 text-[13px] text-[#80878f]">
        Revisa los pasos antes de aplicarlos en producción. La IA puede equivocarse.
      </p>
    </Card>
  );
}