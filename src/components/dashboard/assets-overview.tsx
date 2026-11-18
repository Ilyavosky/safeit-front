import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonClasses } from "@/components/ui/button";
import { SeverityBadge, SeverityBar } from "@/components/findings/severity-badge";
import { SEVERITIES } from "@/constants/severity";
import { ROUTES } from "@/constants/routes";
import type { DomainSummary } from "@/types";

function plural(n: number) {
  return `${n} ${n === 1 ? "activo" : "activos"}`;
}

function subtitle(d: DomainSummary) {
  if (d.status === "pending") return "Falta verificar la propiedad";
  if (d.status === "failed") return "La verificación falló";
  if (d.status === "scanning") return `${plural(d.assets)}, escaneo al ${d.scanProgress ?? 0} %`;
  return d.lastScan ? `${plural(d.assets)}, último escaneo ${d.lastScan}` : plural(d.assets);
}

function DomainRow({ domain }: { domain: DomainSummary }) {
  const openTotal = SEVERITIES.reduce((sum, s) => sum + domain.open[s], 0);
  const worst = SEVERITIES.find((s) => domain.open[s] > 0);

  return (
    <li className="flex items-center gap-3.5 border-t border-[#24282e] px-[22px] py-3">
      <span className="grid size-10 flex-none place-items-center rounded-xl bg-[#23272e] text-[#a0a7b0]">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <Link href={ROUTES.domain(domain.id)} className="block truncate text-[14.5px] font-semibold hover:text-accent">
          {domain.name}
        </Link>
        <p className="mt-px truncate text-[13px] text-[#80878f]">{subtitle(domain)}</p>
      </div>

      <div className="hidden w-[130px] flex-none sm:block">
        {domain.status === "verified" && (
          <div className="flex items-center gap-2.5">
            <SeverityBar counts={domain.open} className="flex-1" />
            <span className="w-4 text-right font-semibold tabular-nums">{openTotal}</span>
          </div>
        )}
        {domain.status === "scanning" && (
          <div className="h-2 rounded-full bg-line">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${domain.scanProgress ?? 0}%` }} />
          </div>
        )}
        {domain.status === "pending" && <Badge dot className="bg-[#39321c] text-[#f0cd6a]">Sin verificar</Badge>}
        {domain.status === "failed" && <Badge dot className="bg-[#3d2620] text-[#ff9a6b]">Falló</Badge>}
      </div>

      <div className="flex w-[110px] flex-none justify-end">
        {domain.status === "verified" &&
          (worst ? <SeverityBadge severity={worst} /> : <span className="text-[13px] text-[#80878f]">Sin hallazgos</span>)}
        {domain.status === "scanning" && <Badge dot className="bg-[#232b45] text-[#a9bbff]">Escaneando</Badge>}
        {(domain.status === "pending" || domain.status === "failed") && (
          <Link href={ROUTES.newDomain} className={buttonClasses("secondary", "h-[34px] rounded-[10px] px-3.5 text-[13px]")}>
            Verificar
          </Link>
        )}
      </div>
    </li>
  );
}

export function AssetsOverview({ domains }: { domains?: DomainSummary[] }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="flex items-center justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
        <h2 className="text-base font-semibold">Tus dominios</h2>
        <Link href={ROUTES.domains} className="text-[13.5px] font-medium text-accent hover:text-accent-hover">
          Ver dominios
        </Link>
      </div>

      {domains === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3.5 border-t border-[#24282e] px-[22px] py-3">
              <span className="size-10 flex-none rounded-xl bg-[#23272e]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-40" />
                <Skeleton className="w-24" />
              </div>
              <Skeleton className="hidden w-[130px] sm:block" />
            </li>
          ))}
        </ul>
      )}

      {domains && domains.length === 0 && (
        <div className="border-t border-[#24282e] px-[22px] py-10 text-center">
          <p className="font-semibold">Todavía no tienes dominios</p>
          <p className="mt-1 text-sm text-muted">Agrega uno y verifica que es tuyo para empezar a escanearlo.</p>
          <Link href={ROUTES.newDomain} className={buttonClasses("primary", "mt-4 h-[42px]")}>
            Agregar dominio
          </Link>
        </div>
      )}

      {domains && domains.length > 0 && (
        <ul>
          {domains.map((d) => (
            <DomainRow key={d.id} domain={d} />
          ))}
        </ul>
      )}
    </Card>
  );
}