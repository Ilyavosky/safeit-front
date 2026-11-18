import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEVERITY_SOLID, SEVERITY_TINT } from "@/components/findings/severity-badge";
import { SEVERITIES, SEVERITY_LABEL } from "@/constants/severity";
import { cn } from "@/lib/utils/cn";
import type { DomainSummary } from "@/types";

function Stat({ label, value, sub }: { label: string; value?: React.ReactNode; sub?: string }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35] px-5 py-[18px]">
      <p className="text-[13px] font-medium text-[#80878f]">{label}</p>
      <div className="mt-1.5 flex min-h-[36px] items-center">
        {value !== undefined ? (
          <p className="text-[28px] font-bold leading-tight tracking-[-0.02em] tabular-nums">{value}</p>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
      {sub && <p className="mt-1 text-[13px] text-[#80878f]">{sub}</p>}
    </Card>
  );
}

export function DomainOverview({ domain }: { domain?: DomainSummary }) {
  const open = domain ? SEVERITIES.reduce((sum, s) => sum + domain.open[s], 0) : undefined;

  return (
    <section aria-label="Resumen del dominio" className="grid gap-3 sm:grid-cols-3">
      <Stat label="Activos" value={domain?.assets} sub="Subdominios y hosts" />
      <Stat label="Hallazgos abiertos" value={open} sub="Sin resolver" />
      <Stat label="Último escaneo" value={domain ? (domain.lastScan ?? "—") : undefined} sub="Del dominio completo" />
    </section>
  );
}

export function DomainSeverity({ domain }: { domain?: DomainSummary }) {
  const max = domain ? Math.max(1, ...SEVERITIES.map((x) => domain.open[x])) : 1;

  return (
    <Card className="h-fit rounded-2xl border-[#2a2e35] px-[22px] py-[18px]">
      <h2 className="text-base font-semibold">Hallazgos por severidad</h2>
      <ul className="mt-4 space-y-3.5">
        {SEVERITIES.map((s) => {
          const count = domain?.open[s];
          return (
            <li key={s} className="grid grid-cols-[104px_minmax(0,1fr)_28px] items-center gap-3">
              <span className={cn("inline-flex h-[24px] w-fit items-center rounded-full px-2.5 text-xs font-semibold", SEVERITY_TINT[s])}>
                {SEVERITY_LABEL[s]}
              </span>
              <div className="h-2 rounded-full bg-[#23272e]">
                {count !== undefined && count > 0 && (
                  <div className={cn("h-2 rounded-full", SEVERITY_SOLID[s])} style={{ width: `${(count / max) * 100}%` }} />
                )}
              </div>
              <span className="text-right text-sm font-semibold tabular-nums">
                {count !== undefined ? count : <span className="text-[#80878f]">–</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}