import { Card } from "@/components/ui/card";
import { SEVERITY_SOLID } from "@/components/findings/severity-badge";
import { SEVERITIES, SEVERITY_LABEL } from "@/constants/severity";
import { FINDING_STATUSES, FINDING_STATUS_COLOR, FINDING_STATUS_LABEL, type FindingStatus } from "@/constants/finding-status";
import { cn } from "@/lib/utils/cn";
import type { SeverityCounts } from "@/types";

export function SeverityChart({
  severities,
  statuses,
}: {
  severities?: SeverityCounts;
  statuses?: Record<FindingStatus, number>;
}) {
  const max = severities ? Math.max(1, ...SEVERITIES.map((s) => severities[s])) : 1;
  const totalStatus = statuses ? FINDING_STATUSES.reduce((sum, s) => sum + statuses[s], 0) : 0;

  return (
    <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
      <h2 className="text-base font-semibold">Hallazgos por severidad</h2>
      <ul className="mt-4 space-y-3">
        {SEVERITIES.map((s) => {
          const n = severities?.[s];
          return (
            <li key={s} className="grid grid-cols-[92px_minmax(0,1fr)_36px] items-center gap-3">
              <span className="text-[13.5px] text-[#c9ced5]">{SEVERITY_LABEL[s]}</span>
              <div className="h-[18px] rounded-md bg-[#23272e]">
                {n !== undefined && n > 0 && (
                  <div className={cn("h-full rounded-md", SEVERITY_SOLID[s])} style={{ width: `${(n / max) * 100}%` }} />
                )}
              </div>
              <span className="text-right text-sm font-semibold tabular-nums">
                {n !== undefined ? n : <span className="text-[#80878f]">–</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-7 text-base font-semibold">Estado de los hallazgos</h2>
      <div className="mt-4 flex h-3 gap-[3px] overflow-hidden rounded-full bg-[#23272e]" role="img" aria-label="Distribución por estado">
        {statuses &&
          totalStatus > 0 &&
          FINDING_STATUSES.filter((s) => statuses[s] > 0).map((s) => (
            <span key={s} className="h-full" style={{ flexGrow: statuses[s], backgroundColor: FINDING_STATUS_COLOR[s] }} />
          ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {FINDING_STATUSES.map((s) => (
          <li key={s} className="flex items-center gap-2 text-[13px]">
            <span className="size-2.5 flex-none rounded-[3px]" style={{ backgroundColor: FINDING_STATUS_COLOR[s] }} aria-hidden="true" />
            <span className="truncate text-muted">{FINDING_STATUS_LABEL[s]}</span>
            <span className="ml-auto font-semibold tabular-nums">{statuses ? statuses[s] : <span className="text-[#80878f]">–</span>}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}