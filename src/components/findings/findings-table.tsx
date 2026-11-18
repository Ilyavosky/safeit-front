"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SEVERITY_SOLID, SeverityBadge } from "@/components/findings/severity-badge";
import { StatusBadge } from "@/components/findings/status-badge";
import { EMPTY_FILTERS, FindingsFilters, type FindingFilterState } from "@/components/findings/findings-filters";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { Finding } from "@/types";

const COLS = "grid-cols-[minmax(0,1fr)_96px_130px_64px_64px_150px_24px]";

function applyFilters(list: Finding[], f: FindingFilterState) {
  const q = f.query.trim().toLowerCase();
  return list.filter(
    (x) =>
      (f.severities.length === 0 || f.severities.includes(x.severity)) &&
      (f.status === "all" || x.status === f.status) &&
      (!f.kevOnly || x.kev) &&
      (q === "" || x.title.toLowerCase().includes(q) || x.asset.toLowerCase().includes(q) || (x.cve ?? "").toLowerCase().includes(q)),
  );
}

export function FindingsTable({ findings }: { findings?: Finding[] }) {
  const [filters, setFilters] = useState<FindingFilterState>(EMPTY_FILTERS);
  const visible = findings ? applyFilters(findings, filters) : undefined;

  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <FindingsFilters value={filters} onChange={setFilters} />

      <div className={cn("hidden gap-4 border-t border-[#24282e] px-[22px] py-2.5 text-[12.5px] font-medium text-[#80878f] lg:grid", COLS)}>
        <span>Hallazgo</span>
        <span>Severidad</span>
        <span>CVE</span>
        <span className="text-right">CVSS</span>
        <span className="text-right">EPSS</span>
        <span>Estado</span>
        <span />
      </div>

      {visible === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i} className={cn("flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 lg:grid", COLS)}>
              <div className="flex flex-1 items-center gap-3.5">
                <span className="h-[34px] w-1 flex-none rounded-full bg-line" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-56" />
                  <Skeleton className="w-32" />
                </div>
              </div>
              <Skeleton className="hidden w-14 lg:block" />
              <Skeleton className="hidden w-24 lg:block" />
              <Skeleton className="ml-auto hidden w-8 lg:block" />
              <Skeleton className="ml-auto hidden w-8 lg:block" />
              <Skeleton className="hidden w-24 lg:block" />
              <span />
            </li>
          ))}
        </ul>
      )}

      {findings && findings.length === 0 && (
        <div className="border-t border-[#24282e] px-[22px] py-14 text-center">
          <p className="font-semibold">Sin hallazgos por ahora</p>
          <p className="mx-auto mt-1 max-w-[44ch] text-sm text-muted">Aparecerán aquí cuando termine el escaneo de alguno de tus dominios verificados.</p>
        </div>
      )}

      {findings && findings.length > 0 && visible && visible.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">Ningún hallazgo coincide con los filtros.</p>
      )}

      {visible && visible.length > 0 && (
        <ul>
          {visible.map((f) => (
            <li key={f.id} className="border-t border-[#24282e]">
              <Link href={ROUTES.finding(f.id)} className={cn("flex items-center gap-4 px-[22px] py-3 hover:bg-[#20242a] lg:grid", COLS)}>
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <span className={cn("w-1 self-stretch rounded-full", SEVERITY_SOLID[f.severity])} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug">{f.title}</p>
                    <p className="mt-0.5 truncate text-[13px] text-[#80878f]">
                      {f.asset}
                      {f.detectedAt && <> · {f.detectedAt}</>}
                    </p>
                  </div>
                </div>
                <span className="hidden lg:block">
                  <SeverityBadge severity={f.severity} />
                </span>
                <span className="hidden truncate font-mono text-[12.5px] text-muted lg:block">
                  {f.cve ?? "—"}
                  {f.kev && <span className="mt-0.5 block font-sans text-xs font-medium text-[#ff8f8f]">En CISA KEV</span>}
                </span>
                <span className="hidden text-right font-semibold tabular-nums lg:block">{f.cvss.toFixed(1)}</span>
                <span className="hidden text-right tabular-nums text-muted lg:block">
                  {f.epss !== undefined ? `${(f.epss * 100).toFixed(0)} %` : "—"}
                </span>
                <span>
                  <StatusBadge status={f.status} />
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="hidden text-[#80878f] lg:block" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}