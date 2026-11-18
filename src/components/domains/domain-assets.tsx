import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/findings/severity-badge";
import { SEVERITIES } from "@/constants/severity";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { DomainAsset } from "@/types";

const COLS = "grid-cols-[minmax(0,1fr)_140px_90px_110px_120px]";

export function DomainAssets({ assets }: { assets?: DomainAsset[] }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="flex items-center justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
        <div>
          <h2 className="text-base font-semibold">Activos encontrados</h2>
          <p className="mt-0.5 text-[13px] text-[#80878f]">Subdominios y hosts que respondieron en el último escaneo.</p>
        </div>
        {assets && <span className="text-sm tabular-nums text-muted">{assets.length}</span>}
      </div>

      <div className={cn("hidden gap-4 border-t border-[#24282e] px-[22px] py-2.5 text-[12.5px] font-medium text-[#80878f] md:grid", COLS)}>
        <span>Host</span>
        <span>IP</span>
        <span className="text-right">Servicios</span>
        <span>Peor hallazgo</span>
        <span>Visto</span>
      </div>

      {assets === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={cn("flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 md:grid", COLS)}>
              <Skeleton className="w-44" />
              <Skeleton className="hidden w-24 md:block" />
              <Skeleton className="ml-auto hidden w-6 md:block" />
              <Skeleton className="hidden w-16 md:block" />
              <Skeleton className="hidden w-20 md:block" />
            </li>
          ))}
        </ul>
      )}

      {assets && assets.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">
          Aún no hay activos. Aparecerán cuando termine el primer escaneo.
        </p>
      )}

      {assets && assets.length > 0 && (
        <ul>
          {assets.map((a) => {
            const worst = SEVERITIES.find((s) => a.open[s] > 0);
            return (
              <li key={a.id} className="border-t border-[#24282e]">
                <Link href={ROUTES.asset(a.id)} className={cn("flex items-center gap-4 px-[22px] py-3 hover:bg-[#20242a] md:grid", COLS)}>
                  <span className="min-w-0 flex-1 truncate font-mono text-[13.5px]">{a.hostname}</span>
                  <span className="hidden truncate font-mono text-[13px] text-muted md:block">{a.ip ?? "—"}</span>
                  <span className="hidden text-right tabular-nums md:block">{a.services}</span>
                  <span>{worst ? <SeverityBadge severity={worst} /> : <span className="text-[13px] text-[#80878f]">Ninguno</span>}</span>
                  <span className="hidden text-[13px] text-muted md:block">{a.lastScan ?? "—"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}