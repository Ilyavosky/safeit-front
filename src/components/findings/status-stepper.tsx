"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FINDING_STATUSES, FINDING_STATUS_LABEL, type FindingStatus } from "@/constants/finding-status";
import { cn } from "@/lib/utils/cn";

const FLOW: FindingStatus[] = ["discovered", "analyzing", "confirmed", "remediating", "resolved"];

const HINT: Record<FindingStatus, string> = {
  discovered: "Lo encontró el escáner.",
  analyzing: "La IA lo está revisando.",
  confirmed: "Se confirmó que es real.",
  remediating: "Alguien lo está corrigiendo.",
  resolved: "El siguiente escaneo ya no lo detectó.",
  false_positive: "Se descartó, no es un riesgo real.",
};

export function StatusStepper({ status }: { status?: FindingStatus }) {
  const [selected, setSelected] = useState<FindingStatus | "">(status ?? "");
  const current = status ? FLOW.indexOf(status) : -1;
  const isFalse = status === "false_positive";

  return (
    <Card className="rounded-2xl border-[#2a2e35] px-[22px] py-[18px]">
      <h2 className="text-base font-semibold">Ciclo de vida</h2>

      <ol className="mt-4">
        {FLOW.map((s, i) => {
          const done = !isFalse && current >= 0 && i < current;
          const now = !isFalse && i === current;
          return (
            <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
              {i < FLOW.length - 1 && (
                <span className={cn("absolute left-[11px] top-6 h-[calc(100%-20px)] w-px", done ? "bg-accent" : "bg-line")} aria-hidden="true" />
              )}
              <span
                className={cn(
                  "relative grid size-6 flex-none place-items-center rounded-full border-2",
                  done && "border-accent bg-accent text-accent-fg",
                  now && "border-accent bg-[#232b45]",
                  !done && !now && "border-line bg-card",
                )}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
                {now && <span className="size-2 rounded-full bg-accent" aria-hidden="true" />}
              </span>
              <div className="min-w-0 pt-0.5" aria-current={now ? "step" : undefined}>
                <p className={cn("text-[14px] font-semibold", !done && !now && "text-muted")}>{FINDING_STATUS_LABEL[s]}</p>
                {now && <p className="mt-0.5 text-[13px] text-[#80878f]">{HINT[s]}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {isFalse && (
        <p className="mt-4 rounded-xl bg-[#212328] px-3.5 py-2.5 text-[13px] text-[#a0a7b0]">
          Marcado como falso positivo. {HINT.false_positive}
        </p>
      )}

      <div className="mt-5 border-t border-[#24282e] pt-4">
        <label htmlFor="finding-status" className="text-[13px] font-medium text-[#c9ced5]">
          Cambiar estado
        </label>
        <div className="mt-2 flex gap-2">
          <select
            id="finding-status"
            value={selected}
            onChange={(e) => setSelected(e.target.value as FindingStatus)}
            className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-field px-3 text-[14px] text-text focus:border-accent focus:shadow-focus focus:outline-none"
          >
            <option value="" disabled>
              Elige un estado
            </option>
            {FINDING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {FINDING_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <Button className="h-10 px-4" disabled={selected === "" || selected === status}>
            Guardar
          </Button>
        </div>
      </div>
    </Card>
  );
}