"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HOST_KINDS, HOST_KIND_ORDER } from "@/components/public/host-kind";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";
import type { HostKind, PublicHostResponse } from "@/lib/api/types";

type Filter = "all" | HostKind;

function tlsLabel(host: PublicHostResponse) {
  if (host.tls_valid === null || host.tls_valid === undefined) return "—";
  const until = formatDate(host.tls_valid_until);
  if (!host.tls_valid) return "Certificado no confiable";
  return until ? `Válido hasta ${until}` : "Válido";
}

export function PublicHostsTable({ hosts }: { hosts: PublicHostResponse[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const present = HOST_KIND_ORDER.filter((k) => hosts.some((h) => h.kind === k));
  const visible = hosts
    .filter((h) => filter === "all" || h.kind === filter)
    .sort((a, b) => HOST_KIND_ORDER.indexOf(a.kind) - HOST_KIND_ORDER.indexOf(b.kind) || a.host.localeCompare(b.host));

  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="flex flex-wrap items-center gap-2 px-[22px] py-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={cn(
            "h-9 rounded-xl px-3.5 text-[13.5px] font-medium transition-colors",
            filter === "all" ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
          )}
        >
          Todos <span className="ml-1 text-xs tabular-nums text-[#80878f]">{hosts.length}</span>
        </button>
        {present.map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setFilter(kind)}
            aria-pressed={filter === kind}
            className={cn(
              "h-9 rounded-xl px-3.5 text-[13.5px] font-medium transition-colors",
              filter === kind ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
            )}
          >
            {HOST_KINDS[kind].label}{" "}
            <span className="ml-1 text-xs tabular-nums text-[#80878f]">{hosts.filter((h) => h.kind === kind).length}</span>
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">No hay hosts en esta categoría.</p>
      ) : (
        <ul>
          {visible.map((host) => (
            <li key={host.host} className="border-t border-[#24282e] px-[22px] py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="min-w-0 break-all text-[14.5px] font-semibold">{host.host}</span>
                <Badge className={HOST_KINDS[host.kind].className}>{HOST_KINDS[host.kind].label}</Badge>
                {host.http_status !== null && host.http_status !== undefined && (
                  <span className="text-[13px] tabular-nums text-muted">HTTP {host.http_status}</span>
                )}
              </div>
              {host.title && <p className="mt-1.5 break-words text-[13.5px] text-[#c9ced5]">{host.title}</p>}
              {host.redirect_host && <p className="mt-1 text-[13px] text-muted">Redirige a {host.redirect_host}</p>}
              <dl className="mt-2.5 grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-[#80878f]">Proveedor</dt>
                  <dd>{host.provider ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[#80878f]">Tecnologías</dt>
                  <dd>{host.technologies.length > 0 ? host.technologies.join(", ") : "—"}</dd>
                </div>
                <div>
                  <dt className="text-[#80878f]">Certificado</dt>
                  <dd className={cn(host.tls_valid === false && "text-[#ff8f8f]")}>
                    {tlsLabel(host)}
                    {host.tls_issuer ? ` · ${host.tls_issuer}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#80878f]">Cabeceras de seguridad</dt>
                  <dd>{host.security_headers.length > 0 ? host.security_headers.join(", ") : "—"}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
