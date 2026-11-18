import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { DomainStatus } from "@/types";

export const DOMAIN_STATUS_LABEL: Record<DomainStatus, string> = {
  verified: "Verificado",
  scanning: "Escaneando",
  pending: "Sin verificar",
  failed: "Falló",
};

export const DOMAIN_STATUS_TINT: Record<DomainStatus, string> = {
  verified: "bg-[#1c3328] text-[#6fd39a]",
  scanning: "bg-[#232b45] text-[#a9bbff]",
  pending: "bg-[#39321c] text-[#f0cd6a]",
  failed: "bg-[#3d2620] text-[#ff9a6b]",
};

export function DomainStatusBadge({ status, className }: { status: DomainStatus; className?: string }) {
  return (
    <Badge dot className={cn(DOMAIN_STATUS_TINT[status], className)}>
      {DOMAIN_STATUS_LABEL[status]}
    </Badge>
  );
}

type CheckStatus = "pending" | "verified" | "failed";

const CHECK_COPY: Record<CheckStatus, { title: string; text: string }> = {
  pending: {
    title: "Esperando verificación",
    text: "Cuando agregues el registro o subas el archivo, presiona Verificar ahora. El DNS puede tardar unos minutos en propagarse.",
  },
  verified: {
    title: "Dominio verificado",
    text: "Confirmamos que el dominio es tuyo. Ya puedes iniciar el primer escaneo.",
  },
  failed: {
    title: "No encontramos el registro",
    text: "Revisa que el valor esté copiado completo y vuelve a intentarlo en unos minutos.",
  },
};

function CheckIcon({ status }: { status: CheckStatus }) {
  if (status === "verified") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 7.5v5.5M12 16.5v.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function VerificationStatus({
  status = "pending",
  checkedAt,
  action,
}: {
  status?: CheckStatus;
  checkedAt?: string;
  action?: React.ReactNode;
}) {
  const tint = {
    pending: "bg-[#39321c] text-[#f0cd6a]",
    verified: "bg-[#1c3328] text-[#6fd39a]",
    failed: "bg-[#3d2620] text-[#ff9a6b]",
  }[status];

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#2a2e35] bg-[#181b20] px-5 py-4" role="status">
      <span className={cn("grid size-10 flex-none place-items-center rounded-xl", tint)}>
        <CheckIcon status={status} />
      </span>
      <div className="min-w-0 flex-1 basis-[240px]">
        <p className="font-semibold">{CHECK_COPY[status].title}</p>
        <p className="mt-0.5 text-[13.5px] text-muted">{CHECK_COPY[status].text}</p>
        {checkedAt && <p className="mt-1 text-xs text-[#80878f]">Última revisión: {checkedAt}</p>}
      </div>
      {action}
    </div>
  );
}