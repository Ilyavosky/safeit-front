"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonClasses } from "@/components/ui/button";
import { SeverityBar } from "@/components/findings/severity-badge";
import { DomainStatusBadge } from "@/components/domains/verification-status";
import { SEVERITIES } from "@/constants/severity";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { DomainSummary } from "@/types";

type Filter = "all" | "verified" | "pending";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "verified", label: "Verificados" },
  { id: "pending", label: "Por verificar" },
];

const COLS = "grid-cols-[minmax(0,1fr)_120px_110px_minmax(150px,200px)_130px_24px]";

function matches(d: DomainSummary, filter: Filter) {
  if (filter === "verified") return d.status === "verified" || d.status === "scanning";
  if (filter === "pending") return d.status === "pending" || d.status === "failed";
  return true;
}

export function DomainsTable({ domains }: { domains?: DomainSummary[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = domains?.filter((d) => matches(d, filter) && d.name.includes(query.trim().toLowerCase()));

  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-[22px] py-4">
        <div role="tablist" aria-label="Filtrar dominios" className="inline-flex rounded-xl border border-line bg-field p-1">
          {FILTERS.map((f) => {
            const count = domains?.filter((d) => matches(d, f.id)).length;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-[9px] px-3.5 text-[13.5px] font-medium transition-colors",
                  filter === f.id ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
                )}
              >
                {f.label}
                {count !== undefined && <span className="text-xs tabular-nums text-[#80878f]">{count}</span>}
              </button>
            );
          })}
        </div>
        <label className="relative w-full sm:w-[260px]">
          <span className="sr-only">Buscar dominio</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#80878f]" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar dominio"
            className="h-10 w-full rounded-xl border border-line bg-field pl-9 pr-3 text-[14px] placeholder:text-[#80878f] focus:border-accent focus:shadow-focus focus:outline-none"
          />
        </label>
      </div>

      <div className={cn("hidden gap-4 border-t border-[#24282e] px-[22px] py-2.5 text-[12.5px] font-medium text-[#80878f] lg:grid", COLS)}>
        <span>Dominio</span>
        <span>Estado</span>
        <span className="text-right">Activos</span>
        <span>Hallazgos abiertos</span>
        <span>Último escaneo</span>
        <span />
      </div>

      {visible === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={cn("flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 lg:grid", COLS)}>
              <div className="flex flex-1 items-center gap-3">
                <span className="size-9 flex-none rounded-[10px] bg-[#23272e]" />
                <Skeleton className="w-40" />
              </div>
              <Skeleton className="hidden w-20 lg:block" />
              <Skeleton className="ml-auto hidden w-8 lg:block" />
              <Skeleton className="hidden w-full lg:block" />
              <Skeleton className="hidden w-20 lg:block" />
              <span />
            </li>
          ))}
        </ul>
      )}

      {domains && domains.length === 0 && (
        <div className="border-t border-[#24282e] px-[22px] py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#23272e] text-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
            </svg>
          </span>
          <p className="mt-4 font-semibold">Todavía no tienes dominios</p>
          <p className="mx-auto mt-1 max-w-[42ch] text-sm text-muted">Agrega uno y verifica que es tuyo. Después podrás escanearlo y ver sus hallazgos.</p>
          <Link href={ROUTES.newDomain} className={buttonClasses("primary", "mt-5 h-[42px]")}>
            Agregar dominio
          </Link>
        </div>
      )}

      {domains && domains.length > 0 && visible && visible.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">Ningún dominio coincide con el filtro.</p>
      )}

      {visible && visible.length > 0 && (
        <ul>
          {visible.map((d) => {
            const open = SEVERITIES.reduce((sum, s) => sum + d.open[s], 0);
            return (
              <li key={d.id} className="border-t border-[#24282e]">
                <Link href={ROUTES.domain(d.id)} className={cn("flex items-center gap-4 px-[22px] py-3.5 hover:bg-[#20242a] lg:grid", COLS)}>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-[#23272e] text-[#a0a7b0]">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
                      </svg>
                    </span>
                    <span className="truncate text-[14.5px] font-semibold">{d.name}</span>
                  </div>
                  <span>
                    <DomainStatusBadge status={d.status} />
                  </span>
                  <span className="hidden text-right tabular-nums lg:block">{d.assets}</span>
                  <span className="hidden items-center gap-2.5 lg:flex">
                    {d.status === "pending" || d.status === "failed" ? (
                      <span className="text-[13px] text-[#80878f]">Sin escanear</span>
                    ) : (
                      <>
                        <SeverityBar counts={d.open} className="flex-1" />
                        <span className="w-6 text-right font-semibold tabular-nums">{open}</span>
                      </>
                    )}
                  </span>
                  <span className="hidden text-[13.5px] text-muted lg:block">{d.lastScan ?? "—"}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="hidden text-[#80878f] lg:block" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}