import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssetDetail } from "@/types";

function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#24282e] py-3 first:border-t-0 first:pt-0">
      <dt className="text-[13.5px] text-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[14px] font-semibold">{children ?? <Skeleton className="w-20" />}</dd>
    </div>
  );
}

export function AssetSummary({ asset }: { asset?: AssetDetail }) {
  return (
    <Card className="h-fit rounded-2xl border-[#2a2e35] px-[22px] py-[18px]">
      <h2 className="text-base font-semibold">Datos del activo</h2>
      <dl className="mt-4">
        <Row label="Dominio">{asset?.domain}</Row>
        <Row label="IP">{asset && <span className="font-mono text-[13px]">{asset.ip ?? "—"}</span>}</Row>
        <Row label="Último escaneo">{asset && (asset.lastScan ?? "—")}</Row>
      </dl>
      <div className="mt-4 border-t border-[#24282e] pt-4">
        <p className="text-[13px] font-medium text-[#80878f]">Tecnologías detectadas</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {asset?.technologies ? (
            asset.technologies.length > 0 ? (
              asset.technologies.map((t) => (
                <span key={t} className="inline-flex h-[26px] items-center rounded-lg bg-[#23272e] px-2.5 text-[12.5px] font-medium text-[#c9ced5]">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-muted">Ninguna</span>
            )
          ) : (
            [0, 1, 2].map((i) => <span key={i} className="h-[26px] w-16 rounded-lg bg-[#23272e]" aria-hidden="true" />)
          )}
        </div>
      </div>
    </Card>
  );
}