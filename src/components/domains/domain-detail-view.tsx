"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/common/error-notice";
import { DomainOverview, DomainSeverity } from "@/components/domains/domain-overview";
import { DomainAssets } from "@/components/domains/domain-assets";
import { VerificationInstructions } from "@/components/domains/verification-instructions";
import { VerificationStatus } from "@/components/domains/verification-status";
import { verificationToProps } from "@/components/domains/verification-props";
import { ROUTES } from "@/constants/routes";
import { useApi } from "@/hooks/use-api";
import { useScanStatus } from "@/hooks/use-scan-status";
import { ApiError } from "@/lib/api/client";
import { deleteDomain, getDomain, startRecon, startTests, verifyDomain } from "@/lib/api/domains";
import { getDashboard } from "@/lib/api/findings";
import { listAssets } from "@/lib/api/assets";
import { isScanActive, toDomainAsset, toDomainSummary } from "@/lib/api/mappers";
import type { ScanResponse } from "@/lib/api/types";

export function DomainDetailView({ domainId }: { domainId: string }) {
  const router = useRouter();
  const domain = useApi(() => getDomain(domainId), [domainId]);
  const verified = domain.data?.status === "verified";
  const dashboard = useApi(verified ? () => getDashboard({ domain_id: domainId }) : null, [domainId, verified]);
  const assets = useApi(verified ? () => listAssets(domainId) : null, [domainId, verified]);

  const [scanId, setScanId] = useState<string>();
  const [starting, setStarting] = useState<"recon" | "tests">();
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();
  const [verifying, setVerifying] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState<string>();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState<string>();

  const scan = useScanStatus(scanId, (done: ScanResponse) => {
    setMessage(
      done.status === "done"
        ? { ok: true, text: done.type === "recon" ? "El reconocimiento terminó." : "Las pruebas terminaron." }
        : { ok: false, text: "El escaneo falló. Revisa el registro de auditoría." },
    );
    assets.reload();
    dashboard.reload();
  });
  const scanning = starting !== undefined || isScanActive(scan);

  async function launch(kind: "recon" | "tests") {
    setStarting(kind);
    setMessage(undefined);
    try {
      const res = await (kind === "recon" ? startRecon(domainId) : startTests(domainId));
      setScanId(res.id);
    } catch (err) {
      setMessage({ ok: false, text: err instanceof ApiError ? err.message : "No pudimos iniciar el escaneo." });
    } finally {
      setStarting(undefined);
    }
  }

  async function remove() {
    setDeleting(true);
    setDeleteFailed(undefined);
    try {
      await deleteDomain(domainId);
      router.push(ROUTES.domains);
    } catch (err) {
      setDeleteFailed(err instanceof ApiError ? err.message : "No pudimos eliminar el dominio.");
      setDeleting(false);
    }
  }

  async function verify() {
    setVerifying(true);
    setVerifyFailed(undefined);
    try {
      await verifyDomain(domainId);
      domain.reload();
    } catch (err) {
      setVerifyFailed(err instanceof ApiError ? err.message : "No pudimos verificar el dominio.");
    } finally {
      setVerifying(false);
    }
  }

  const summary = domain.data
    ? toDomainSummary(domain.data, { dashboard: dashboard.data, scanning: isScanActive(scan) })
    : undefined;
  const props = domain.data ? verificationToProps(domain.data) : undefined;

  return (
    <>
      <PageHeader
        title={domain.data ? domain.data.name : <Skeleton className="mt-2 h-5 w-56" />}
        breadcrumb={[{ label: "Dominios", href: ROUTES.domains }, { label: "Detalle" }]}
        actions={
          <>
            {verified && (
              <>
                <Link href={ROUTES.findings} className={buttonClasses("secondary", "h-[42px]")}>
                  Ver hallazgos
                </Link>
                <Button variant="secondary" className="h-[42px]" onClick={() => launch("tests")} disabled={scanning}>
                  Ejecutar pruebas
                </Button>
                <Button className="h-[42px]" onClick={() => launch("recon")} loading={scanning}>
                  {scanning ? "Escaneando" : "Escanear ahora"}
                </Button>
              </>
            )}
            {domain.data && (
              <Button
                variant="secondary"
                className="h-[42px] text-[#ff8f8f]"
                onClick={() => setConfirmingDelete(true)}
                disabled={confirmingDelete}
              >
                Eliminar dominio
              </Button>
            )}
          </>
        }
      />
      <ErrorNotice error={domain.error} onRetry={domain.reload} />
      {confirmingDelete && domain.data && (
        <Card className="rounded-2xl border-[#5c2a2a] px-6 py-5" role="alertdialog" aria-label="Confirmar eliminación">
          <h2 className="text-base font-semibold">¿Eliminar {domain.data.name}?</h2>
          <p className="mt-1 text-sm text-muted">
            Se borrarán sus activos, escaneos, hallazgos y reportes. Esta acción no se puede deshacer.
          </p>
          {deleteFailed && (
            <p role="alert" className="mt-3 text-[13px] text-[#ff8f8f]">
              {deleteFailed}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <Button className="h-[42px] bg-[#c0392b] text-white hover:bg-[#a93226]" onClick={remove} loading={deleting}>
              Sí, eliminar
            </Button>
            <Button
              variant="secondary"
              className="h-[42px]"
              onClick={() => {
                setConfirmingDelete(false);
                setDeleteFailed(undefined);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
          </div>
        </Card>
      )}
      {message && (
        <p role="status" className={message.ok ? "text-[13.5px] text-[#6fd39a]" : "text-[13.5px] text-[#ff8f8f]"}>
          {message.text}
        </p>
      )}

      {domain.data && !verified && props && (
        <Card className="rounded-2xl border-[#2a2e35] px-6 py-6">
          <h2 className="text-lg font-semibold">Verifica que {domain.data.name} es tuyo</h2>
          <p className="mt-1 text-sm text-muted">Hasta que lo verifiques no podemos escanearlo.</p>
          <div className="mt-6 space-y-6">
            <VerificationInstructions
              domain={domain.data.name}
              record={props.record}
              file={props.file}
              fixedMethod={props.method}
            />
            <VerificationStatus
              status={domain.data.status === "failed" ? "failed" : "pending"}
              action={
                <Button className="h-[42px]" onClick={verify} loading={verifying}>
                  Verificar ahora
                </Button>
              }
            />
            {verifyFailed && (
              <p role="alert" className="text-[13px] text-[#ff8f8f]">
                {verifyFailed}
              </p>
            )}
          </div>
        </Card>
      )}

      {verified && (
        <>
          <DomainOverview domain={summary} />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <DomainAssets assets={assets.data?.map(toDomainAsset)} />
            <DomainSeverity domain={summary} />
          </div>
          <ErrorNotice error={assets.error ?? dashboard.error} onRetry={() => (assets.error ? assets.reload() : dashboard.reload())} />
        </>
      )}
    </>
  );
}
