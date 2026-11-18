import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEVERITY_SOLID } from "@/components/findings/severity-badge";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { PriorityFinding } from "@/types";

export function RecentFindings({ findings }: { findings?: PriorityFinding[] }) {
  return (
    <Card className="flex flex-col rounded-2xl border-[#2a2e35]">
      <div className="flex items-center justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
        <h2 className="text-base font-semibold">Atiende primero</h2>
        <Link href={ROUTES.findings} className="text-[13.5px] font-medium text-accent hover:text-accent-hover">
          Ver hallazgos
        </Link>
      </div>

      {findings === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3.5 border-t border-[#24282e] px-[22px] py-3">
              <span className="h-[38px] w-1 flex-none rounded-full bg-line" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-48" />
                <Skeleton className="w-28" />
              </div>
              <Skeleton className="w-8" />
            </li>
          ))}
        </ul>
      )}

      {findings && findings.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">
          No hay hallazgos urgentes por ahora.
        </p>
      )}

      {findings && findings.length > 0 && (
        <ul>
          {findings.map((f) => (
            <li key={f.id} className="border-t border-[#24282e]">
              <Link href={ROUTES.finding(f.id)} className="flex items-center gap-3.5 px-[22px] py-[11px] hover:bg-[#20242a]">
                <span className={cn("w-1 self-stretch rounded-full", SEVERITY_SOLID[f.severity])} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">{f.title}</p>
                  <p className="mt-0.5 truncate text-[13px] text-[#80878f]">{f.asset}</p>
                </div>
                <div className="flex-none text-right">
                  <p className="text-[15px] font-bold tabular-nums">{f.cvss.toFixed(1)}</p>
                  <p className={cn("text-xs", f.kev ? "text-[#ff8f8f]" : "text-[#80878f]")}>{f.kev ? "En CISA KEV" : "CVSS"}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-auto border-t border-[#24282e] px-[22px] py-3 text-[13px] text-[#80878f]">
        Orden: CISA KEV primero, luego severidad y EPSS.
      </p>
    </Card>
  );
}