"use client";

import { cn } from "@/lib/utils/cn";
import type { AuditCategory } from "@/types";

export const AUDIT_CATEGORY_LABEL: Record<AuditCategory, string> = {
  auth: "Acceso",
  domain: "Dominios",
  scan: "Escaneos",
  finding: "Hallazgos",
  settings: "Configuración",
};

export type AuditFilterState = {
  query: string;
  category: AuditCategory | "all";
};

export const EMPTY_AUDIT_FILTERS: AuditFilterState = { query: "", category: "all" };

const OPTIONS: (AuditCategory | "all")[] = ["all", "auth", "domain", "scan", "finding", "settings"];

export function AuditFilters({ value, onChange }: { value: AuditFilterState; onChange: (next: AuditFilterState) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-[22px] py-4">
      <div role="tablist" aria-label="Filtrar por tipo" className="flex flex-wrap gap-1 rounded-xl border border-line bg-field p-1">
        {OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={value.category === c}
            onClick={() => onChange({ ...value, category: c })}
            className={cn(
              "h-9 rounded-[9px] px-3.5 text-[13.5px] font-medium transition-colors",
              value.category === c ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
            )}
          >
            {c === "all" ? "Todo" : AUDIT_CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      <label className="relative w-full sm:w-[260px]">
        <span className="sr-only">Buscar en la auditoría</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#80878f]" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          type="search"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Buscar usuario, acción o IP"
          className="h-10 w-full rounded-xl border border-line bg-field pl-9 pr-3 text-[14px] placeholder:text-[#80878f] focus:border-accent focus:shadow-focus focus:outline-none"
        />
      </label>
    </div>
  );
}