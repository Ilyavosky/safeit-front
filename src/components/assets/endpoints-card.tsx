"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { setWhitelist } from "@/lib/api/assets";
import { ApiError } from "@/lib/api/client";
import type { EndpointResponse } from "@/lib/api/types";

export function EndpointsCard({ endpoints }: { endpoints?: EndpointResponse[] }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string>();

  async function toggle(e: EndpointResponse, value: boolean) {
    setError(undefined);
    setOverrides((o) => ({ ...o, [e.id]: value }));
    try {
      await setWhitelist(e.id, value);
    } catch (err) {
      setOverrides((o) => ({ ...o, [e.id]: !value }));
      setError(err instanceof ApiError ? err.message : "No pudimos cambiar el permiso.");
    }
  }

  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="px-[22px] pb-3.5 pt-[18px]">
        <h2 className="text-base font-semibold">Endpoints para pruebas</h2>
        <p className="mt-0.5 text-[13px] text-[#80878f]">Solo se prueban los endpoints que autorizas aquí.</p>
      </div>
      {error && (
        <p role="alert" className="px-[22px] pb-3 text-[13px] text-[#ff8f8f]">
          {error}
        </p>
      )}
      {endpoints && endpoints.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-8 text-center text-sm text-muted">No se detectaron endpoints web en este activo.</p>
      )}
      {endpoints && endpoints.length > 0 && (
        <ul>
          {endpoints.map((e) => {
            const on = overrides[e.id] ?? e.whitelisted;
            return (
              <li key={e.id} className="flex items-center gap-4 border-t border-[#24282e] px-[22px] py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[13px]">{e.url}</p>
                  <p className="mt-0.5 text-[12.5px] text-[#80878f]">
                    {e.http_status ? `HTTP ${e.http_status}` : "Sin respuesta"}
                    {e.technologies.length > 0 && ` · ${e.technologies.join(", ")}`}
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#c9ced5]">
                  <input type="checkbox" checked={on} onChange={(ev) => toggle(e, ev.target.checked)} className="size-[18px] accent-accent" />
                  Autorizar
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
