"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AUDIT_CATEGORY_LABEL, AuditFilters, EMPTY_AUDIT_FILTERS, type AuditFilterState } from "@/components/audit/audit-filters";
import { cn } from "@/lib/utils/cn";
import type { AuditCategory, AuditEntry } from "@/types";

const COLS = "grid-cols-[150px_minmax(140px,180px)_120px_minmax(0,1fr)_130px]";

const CATEGORY_TINT: Record<AuditCategory, string> = {
  auth: "bg-[#232b45] text-[#a9bbff]",
  domain: "bg-[#1c3328] text-[#6fd39a]",
  scan: "bg-[#2a2e35] text-[#b4bac2]",
  finding: "bg-[#3d2a1c] text-[#ffad70]",
  settings: "bg-[#39321c] text-[#f0cd6a]",
};

function filter(list: AuditEntry[], f: AuditFilterState) {
  const q = f.query.trim().toLowerCase();
  return list.filter(
    (e) =>
      (f.category === "all" || e.category === f.category) &&
      (q === "" || [e.actor, e.action, e.target ?? "", e.ip ?? ""].some((v) => v.toLowerCase().includes(q))),
  );
}

export function AuditTable({ entries }: { entries?: AuditEntry[] }) {
  const [filters, setFilters] = useState<AuditFilterState>(EMPTY_AUDIT_FILTERS);
  const visible = entries ? filter(entries, filters) : undefined;

  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <AuditFilters value={filters} onChange={setFilters} />

      <div className={cn("hidden gap-4 border-t border-[#24282e] px-[22px] py-2.5 text-[12.5px] font-medium text-[#80878f] lg:grid", COLS)}>
        <span>Fecha</span>
        <span>Usuario</span>
        <span>Tipo</span>
        <span>Acción</span>
        <span>IP</span>
      </div>

      {visible === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i} className={cn("flex flex-col gap-2.5 border-t border-[#24282e] px-[22px] py-4 lg:grid lg:items-center lg:gap-4", COLS)}>
              <Skeleton className="w-24" />
              <Skeleton className="w-28" />
              <Skeleton className="hidden w-16 lg:block" />
              <Skeleton className="w-3/4" />
              <Skeleton className="hidden w-20 lg:block" />
            </li>
          ))}
        </ul>
      )}

      {entries && entries.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-12 text-center text-sm text-muted">Todavía no hay movimientos registrados.</p>
      )}

      {entries && entries.length > 0 && visible && visible.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">Ningún movimiento coincide con el filtro.</p>
      )}

      {visible && visible.length > 0 && (
        <ul>
          {visible.map((e) => (
            <li key={e.id} className={cn("flex flex-col gap-1.5 border-t border-[#24282e] px-[22px] py-3 lg:grid lg:items-center lg:gap-4", COLS)}>
              <span className="text-[13px] tabular-nums text-muted">{e.at}</span>
              <span className="truncate text-[14px] font-medium">{e.actor}</span>
              <span>
                <span className={cn("inline-flex h-[24px] items-center rounded-full px-2.5 text-xs font-semibold", CATEGORY_TINT[e.category])}>
                  {AUDIT_CATEGORY_LABEL[e.category]}
                </span>
              </span>
              <span className="min-w-0 text-[14px] text-[#d5d9de]">
                {e.action}
                {e.target && <span className="ml-1.5 font-mono text-[12.5px] text-muted">{e.target}</span>}
              </span>
              <span className="font-mono text-[12.5px] text-muted">{e.ip ?? "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}