import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import type { AssetService } from "@/types";

const COLS = "grid-cols-[90px_120px_minmax(0,1fr)_110px]";

export function ServicesTable({ services }: { services?: AssetService[] }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35]">
      <div className="flex items-center justify-between gap-3 px-[22px] pb-3.5 pt-[18px]">
        <div>
          <h2 className="text-base font-semibold">Puertos y servicios</h2>
          <p className="mt-0.5 text-[13px] text-[#80878f]">Lo que respondió a Nmap y httpx en el último escaneo.</p>
        </div>
        {services && <span className="text-sm tabular-nums text-muted">{services.length}</span>}
      </div>

      <div className={cn("hidden gap-4 border-t border-[#24282e] px-[22px] py-2.5 text-[12.5px] font-medium text-[#80878f] sm:grid", COLS)}>
        <span>Puerto</span>
        <span>Servicio</span>
        <span>Producto y versión</span>
        <span>Cifrado</span>
      </div>

      {services === undefined && (
        <ul aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={cn("flex items-center gap-4 border-t border-[#24282e] px-[22px] py-4 sm:grid", COLS)}>
              <Skeleton className="w-14" />
              <Skeleton className="w-16" />
              <Skeleton className="hidden w-40 sm:block" />
              <Skeleton className="hidden w-12 sm:block" />
            </li>
          ))}
        </ul>
      )}

      {services && services.length === 0 && (
        <p className="border-t border-[#24282e] px-[22px] py-10 text-center text-sm text-muted">No se encontraron puertos abiertos.</p>
      )}

      {services && services.length > 0 && (
        <ul>
          {services.map((s) => (
            <li key={`${s.protocol}-${s.port}`} className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#24282e] px-[22px] py-3 sm:grid", COLS)}>
              <span className="font-mono text-[13.5px] font-semibold">
                {s.port}
                <span className="font-normal text-[#80878f]">/{s.protocol}</span>
              </span>
              <span className="text-[14px]">{s.service}</span>
              <span className="min-w-0 truncate font-mono text-[13px] text-muted">
                {[s.product, s.version].filter(Boolean).join(" ") || "—"}
              </span>
              <span>
                {s.tls === undefined ? (
                  <span className="text-[13px] text-[#80878f]">—</span>
                ) : (
                  <span
                    className={cn(
                      "inline-flex h-[24px] items-center rounded-full px-2.5 text-xs font-semibold",
                      s.tls ? "bg-[#1c3328] text-[#6fd39a]" : "bg-[#3d2620] text-[#ff9a6b]",
                    )}
                  >
                    {s.tls ? "TLS" : "Sin cifrar"}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}