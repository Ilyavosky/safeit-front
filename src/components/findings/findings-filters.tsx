"use client";

import { SEVERITY_SOLID } from "@/components/findings/severity-badge";
import { SEVERITIES, SEVERITY_LABEL, type Severity } from "@/constants/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABEL, type FindingStatus } from "@/constants/finding-status";
import { cn } from "@/lib/utils/cn";

export type FindingFilterState = {
  query: string;
  severities: Severity[];
  status: FindingStatus | "all";
  kevOnly: boolean;
};

export const EMPTY_FILTERS: FindingFilterState = { query: "", severities: [], status: "all", kevOnly: false };

export function FindingsFilters({
  value,
  onChange,
}: {
  value: FindingFilterState;
  onChange: (next: FindingFilterState) => void;
}) {
  const active = value.query !== "" || value.severities.length > 0 || value.status !== "all" || value.kevOnly;

  function toggleSeverity(s: Severity) {
    const has = value.severities.includes(s);
    onChange({ ...value, severities: has ? value.severities.filter((x) => x !== s) : [...value.severities, s] });
  }

  return (
    <div className="space-y-3 px-[22px] py-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Buscar hallazgo</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#80878f]" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Buscar por título, activo o CVE"
            className="h-10 w-full rounded-xl border border-line bg-field pl-9 pr-3 text-[14px] placeholder:text-[#80878f] focus:border-accent focus:shadow-focus focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-[13.5px] text-muted">
          <span>Estado</span>
          <select
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value as FindingFilterState["status"] })}
            className="h-10 rounded-xl border border-line bg-field px-3 text-[14px] text-text focus:border-accent focus:shadow-focus focus:outline-none"
          >
            <option value="all">Todos</option>
            {FINDING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {FINDING_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line bg-field px-3 text-[13.5px] text-[#c9ced5]">
          <input
            type="checkbox"
            checked={value.kevOnly}
            onChange={(e) => onChange({ ...value, kevOnly: e.target.checked })}
            className="size-4 accent-accent"
          />
          Solo en CISA KEV
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] text-[#80878f]">Severidad</span>
        {SEVERITIES.map((s) => {
          const on = value.severities.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => toggleSeverity(s)}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors",
                on ? "border-[#4a5160] bg-[#2a2f38] text-text" : "border-line text-muted hover:text-text",
              )}
            >
              <span className={cn("size-2 rounded-full", SEVERITY_SOLID[s])} aria-hidden="true" />
              {SEVERITY_LABEL[s]}
            </button>
          );
        })}
        {active && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="ml-auto h-8 rounded-lg px-2.5 text-[13px] font-medium text-accent hover:text-accent-hover"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}