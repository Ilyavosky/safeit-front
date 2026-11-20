"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonClasses } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { PublicAnalysisStatus } from "@/components/public/public-analysis-status";
import { PublicHostsTable } from "@/components/public/public-hosts-table";
import { readStats } from "@/components/public/public-analysis-stats";
import { usePublicAnalysis } from "@/hooks/use-public-analysis";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/utils/format-date";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" }) {
  return (
    <Card className="rounded-2xl border-[#2a2e35] px-5 py-4">
      <p className="text-[13px] text-muted">{label}</p>
      <p className={`mt-1 text-[26px] font-semibold tabular-nums ${tone === "warn" && value > 0 ? "text-[#f0b36b]" : ""}`}>{value}</p>
    </Card>
  );
}

function YesNo({ label, ok, hint }: { label: string; ok: boolean; hint: string }) {
  return (
    <li className="flex items-start justify-between gap-4 py-2 text-[13.5px]">
      <span>
        <span className="font-medium">{label}</span>
        <span className="block text-[12.5px] text-[#80878f]">{hint}</span>
      </span>
      <span className={ok ? "text-[#6fcf97]" : "text-[#f0b36b]"}>{ok ? "Presente" : "No encontrado"}</span>
    </li>
  );
}

export function PublicAnalysisDetail({ analysisId }: { analysisId: string }) {
  const { analysis, error } = usePublicAnalysis(analysisId);
  const crumbs = [{ label: "Análisis público", href: ROUTES.publicAnalysis }, { label: analysis?.domain ?? "Detalle" }];

  if (error) {
    return (
      <>
        <PageHeader title="Análisis no disponible" breadcrumb={crumbs} />
        <Card className="rounded-2xl border-[#2a2e35] px-6 py-8 text-center">
          <p className="font-semibold">No encontramos este análisis</p>
          <p className="mx-auto mt-1 max-w-[46ch] text-sm text-muted">Puede que haya caducado, porque los resultados se borran a los 30 días, o que no sea tuyo.</p>
          <Link href={ROUTES.publicAnalysis} className={buttonClasses("primary", "mt-5 h-[42px]")}>
            Volver
          </Link>
        </Card>
      </>
    );
  }

  if (!analysis) {
    return (
      <>
        <PageHeader title="Cargando análisis" breadcrumb={crumbs} />
        <Skeleton className="h-40 w-full" />
      </>
    );
  }

  const active = analysis.status === "queued" || analysis.status === "running";
  const stats = readStats(analysis.stats);

  return (
    <div className="space-y-6">
      <PageHeader
        title={analysis.domain}
        breadcrumb={crumbs}
        badges={<PublicAnalysisStatus status={analysis.status} />}
        description={`Los resultados se conservan hasta el ${formatDate(analysis.expires_at) ?? "—"}.`}
        actions={
          <Link href={ROUTES.publicAnalysis} className={buttonClasses("secondary", "h-[42px]")}>
            Nuevo análisis
          </Link>
        }
      />

      {active && (
        <Card role="status" className="flex items-center gap-4 rounded-2xl border-[#2a2e35] px-6 py-5">
          <span className="size-5 flex-none animate-spin rounded-full border-2 border-accent border-r-transparent" aria-hidden="true" />
          <div>
            <p className="font-semibold">{analysis.status === "queued" ? "Esperando turno" : "Analizando el dominio"}</p>
            <p className="text-[13.5px] text-muted">Puede tardar uno o dos minutos. Esta página se actualiza sola.</p>
          </div>
        </Card>
      )}

      {analysis.status === "failed" && (
        <Card role="alert" className="rounded-2xl border-[#4a2a2a] px-6 py-5">
          <p className="font-semibold text-[#ff8f8f]">El análisis no pudo completarse</p>
          <p className="mt-0.5 text-[13.5px] text-muted">{analysis.error ?? "Intenta de nuevo en unos minutos."}</p>
        </Card>
      )}

      {analysis.status === "done" && (
        <>
          <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
            <h2 className="font-semibold">Resumen</h2>
            {analysis.summary ? (
              <>
                <p className="mt-2 max-w-[75ch] whitespace-pre-line text-[14.5px] leading-relaxed text-[#dfe3e8]">{analysis.summary}</p>
                <p className="mt-3 text-[12.5px] text-[#80878f]">
                  Explicación generada por IA a partir de lo observado. Puede contener errores; confirma lo importante.
                </p>
              </>
            ) : (
              <p className="mt-2 text-[13.5px] text-muted">No se pudo generar la explicación esta vez. Los datos de abajo sí están completos.</p>
            )}
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Hosts encontrados" value={stats.totalHosts} />
            <Stat label="Con sitio web" value={stats.withWeb} />
            <Stat label="Certificados con problemas" value={stats.tlsInvalid + stats.tlsExpiringSoon} tone="warn" />
            <Stat label="Sin HSTS" value={stats.withoutHsts} tone="warn" />
          </div>
          {stats.truncated && (
            <p className="text-[13px] text-muted">Se muestran los primeros 50 hosts. El dominio tiene más.</p>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
              <h2 className="font-semibold">Correo y DNS</h2>
              <ul className="mt-2 divide-y divide-[#24282e]">
                <YesNo label="SPF" ok={stats.dns.spf} hint="Indica qué servidores pueden enviar correo por el dominio." />
                <YesNo label="DMARC" ok={stats.dns.dmarc} hint="Define qué hacer con correos que dicen ser del dominio y no lo son." />
                <YesNo label="CAA" ok={stats.dns.caa} hint="Limita qué entidades pueden emitir certificados." />
              </ul>
            </Card>
            <Card className="rounded-2xl border-[#2a2e35] px-6 py-5">
              <h2 className="font-semibold">Quién lo aloja</h2>
              <dl className="mt-3 space-y-3 text-[13.5px]">
                <div>
                  <dt className="text-[#80878f]">Proveedores detectados</dt>
                  <dd>{stats.providers.length > 0 ? stats.providers.join(", ") : "No se identificó ninguno"}</dd>
                </div>
                <div>
                  <dt className="text-[#80878f]">Servidores de nombres</dt>
                  <dd className="break-all">{stats.dns.nameservers.length > 0 ? stats.dns.nameservers.join(", ") : "—"}</dd>
                </div>
                <div>
                  <dt className="text-[#80878f]">Servidores de correo</dt>
                  <dd className="break-all">{stats.dns.mailHosts.length > 0 ? stats.dns.mailHosts.join(", ") : "—"}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <section aria-labelledby="hosts-titulo" className="space-y-3">
            <h2 id="hosts-titulo" className="text-[15px] font-semibold">
              Subdominios y qué hay en cada uno
            </h2>
            <PublicHostsTable hosts={analysis.hosts} />
          </section>
        </>
      )}
    </div>
  );
}
