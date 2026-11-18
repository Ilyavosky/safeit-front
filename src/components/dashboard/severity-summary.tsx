import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEVERITY_SOLID, SEVERITY_TINT } from "@/components/findings/severity-badge";
import { SEVERITY_LABEL, type Severity } from "@/constants/severity";
import { cn } from "@/lib/utils/cn";
import type { RiskScore, SeverityCounts } from "@/types";

const TILES: { severity: Severity; label: string; hint: string }[] = [
  { severity: "critical", label: "Crítico", hint: "Atiéndelos hoy" },
  { severity: "high", label: "Alto", hint: "Esta semana" },
  { severity: "medium", label: "Medio", hint: "Planifícalos" },
  { severity: "low", label: "Bajo", hint: "Cuando puedas" },
  { severity: "info", label: "Info", hint: "Solo informativo" },
];

function arcPath(value: number) {
  const t = (Math.min(Math.max(value, 0), 100) / 100) * Math.PI;
  const x = 100 - 80 * Math.cos(t);
  const y = 100 - 80 * Math.sin(t);
  return `M20 100 A80 80 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
}

function RiskScoreCard({ score }: { score?: RiskScore }) {
  return (
    <Card className="flex flex-col rounded-2xl border-[#2a2e35] px-[22px] py-[18px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Puntaje de riesgo</h2>
        {score && (
          <span className={cn("inline-flex h-[26px] items-center rounded-full px-2.5 text-[12.5px] font-semibold", SEVERITY_TINT[score.level])}>
            {SEVERITY_LABEL[score.level]}
          </span>
        )}
      </div>
      <div className="relative mx-auto mt-2 h-[112px] w-[200px]">
        <svg width="200" height="112" viewBox="0 0 200 112" fill="none" aria-hidden="true">
          <path d="M20 100 A80 80 0 0 1 180 100" stroke="#2a2e35" strokeWidth="14" strokeLinecap="round" />
          {score && score.value > 0 && (
            <path d={arcPath(score.value)} stroke="#f59145" strokeWidth="14" strokeLinecap="round" />
          )}
        </svg>
        <div className="absolute inset-x-0 top-[52px] text-center">
          {score ? (
            <p className="text-4xl font-bold leading-none tracking-[-0.02em] tabular-nums">{score.value}</p>
          ) : (
            <Skeleton className="mx-auto h-7 w-14" />
          )}
          <p className="mt-1 text-xs text-[#80878f]">de 100</p>
        </div>
      </div>
      <div className="mt-1 flex justify-center">
        {score ? (
          <p className="text-[13px] text-[#80878f]">
            {score.openFindings} abiertos de {score.totalFindings} hallazgos
          </p>
        ) : (
          <Skeleton className="w-36" />
        )}
      </div>
    </Card>
  );
}

function SeverityTiles({ counts }: { counts?: SeverityCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {TILES.map(({ severity, label, hint }) => (
        <div
          key={severity}
          className={cn("flex min-h-[150px] flex-col justify-between rounded-2xl px-4 py-[18px]", SEVERITY_TINT[severity])}
        >
          <div className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-[3px]", SEVERITY_SOLID[severity])} aria-hidden="true" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
          <p className="text-[38px] font-bold leading-none tracking-[-0.02em] text-white tabular-nums">
            {counts ? counts[severity] : <span className="opacity-40">–</span>}
          </p>
          <p className="text-[13px] opacity-85">{hint}</p>
        </div>
      ))}
    </div>
  );
}

export function SeveritySummary({ score, counts }: { score?: RiskScore; counts?: SeverityCounts }) {
  return (
    <section aria-label="Resumen de riesgo" className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <RiskScoreCard score={score} />
      <SeverityTiles counts={counts} />
    </section>
  );
}