"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorIcon } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

type MfaSetupProps = {
  qrCode?: string;
  secret?: string;
  backupCodes?: string[];
};

const TITLES = {
  1: { title: "Escanea el código", description: "Abre Google Authenticator, Authy o Microsoft Authenticator y escanea este código." },
  2: { title: "Confirma el código", description: "Escribe el código de 6 dígitos que muestra tu app para comprobar que quedó bien." },
  3: { title: "Guarda tus códigos", description: "Si pierdes el teléfono, cada código te deja entrar una sola vez." },
} as const;

const BACKUP_SLOTS = 10;

export function MfaSetup({ qrCode, secret, backupCodes = [] }: MfaSetupProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasCodes = backupCodes.length > 0;

  function confirmCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeError("Escribe los 6 dígitos del código.");
      return;
    }
    setStep(3);
  }

  async function copyCodes() {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function downloadCodes() {
    const text = `Códigos de respaldo de SafeIT\n\n${backupCodes.join("\n")}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "safeit-codigos-de-respaldo.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AuthCard
      title={TITLES[step].title}
      description={TITLES[step].description}
      header={
        <>
          <p className="text-center text-[13px] text-muted">Configurar MFA, paso {step} de 3</p>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-1 flex-1 rounded-full", n <= step ? "bg-accent" : "bg-line")} />
            ))}
          </div>
        </>
      }
    >
      {step === 1 && (
        <div>
          <div className="flex justify-center">
            {qrCode ? (
              <div className="rounded-[14px] bg-white p-1.5">
                <Image src={qrCode} alt="Código QR para tu app de autenticación" width={148} height={148} unoptimized />
              </div>
            ) : (
              <div className="grid size-[160px] place-items-center rounded-[14px] border border-line bg-field text-[#4a515c]" aria-label="Código QR pendiente">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
                </svg>
              </div>
            )}
          </div>
          <p className="mt-4 text-center text-[13px] text-muted">¿No puedes escanear? Escribe esta clave en la app:</p>
          <div className="mt-2 flex h-11 items-center justify-center rounded-xl border border-line bg-field text-sm font-semibold tracking-[2px] text-[#dfe3e8]">
            {secret ?? <span className="h-2.5 w-40 rounded-full bg-line" aria-hidden="true" />}
          </div>
          <Button type="button" fullWidth className="mt-5" onClick={() => setStep(2)}>
            Ya lo escaneé
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={confirmCode} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="setup-code" className="sr-only">
              Código de 6 dígitos
            </label>
            <input
              id="setup-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (codeError) setCodeError(undefined);
              }}
              aria-invalid={codeError ? true : undefined}
              aria-describedby="setup-code-message"
              className={cn(
                "h-14 w-full rounded-xl border bg-field pl-3 text-center text-[26px] tracking-[12px] text-text placeholder:text-[#4a515c] focus:outline-none",
                codeError ? "border-[#ef5f5f] focus:shadow-focus-danger" : "border-line focus:border-accent focus:shadow-focus",
              )}
            />
            {codeError ? (
              <p id="setup-code-message" role="alert" className="mt-[7px] flex items-start justify-center gap-1.5 text-[13px] text-[#ff8f8f]">
                <ErrorIcon />
                <span>{codeError}</span>
              </p>
            ) : (
              <p id="setup-code-message" className="mt-[7px] text-center text-[12.5px] text-[#80878f]">
                El código cambia cada 30 segundos.
              </p>
            )}
          </div>
          <Button type="submit" fullWidth>
            Confirmar y continuar
          </Button>
          <Button type="button" variant="ghost" fullWidth onClick={() => setStep(1)}>
            Volver al código QR
          </Button>
        </form>
      )}

      {step === 3 && (
        <div>
          <ul className="grid grid-cols-2 gap-x-5 rounded-[14px] border border-line bg-field px-5 py-3 text-center">
            {hasCodes
              ? backupCodes.map((c) => (
                  <li key={c} className="py-1.5 text-[14.5px] font-semibold tracking-[1px] tabular-nums">
                    {c}
                  </li>
                ))
              : Array.from({ length: BACKUP_SLOTS }, (_, i) => (
                  <li key={i} className="flex h-[34px] items-center justify-center" aria-hidden="true">
                    <span className="h-2.5 w-24 rounded-full bg-line" />
                  </li>
                ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Button type="button" variant="secondary" className="h-[42px]" onClick={downloadCodes} disabled={!hasCodes}>
              <DownloadIcon />
              Descargar
            </Button>
            <Button type="button" variant="secondary" className="h-[42px]" onClick={copyCodes} disabled={!hasCodes}>
              <CopyIcon />
              {copied ? "Copiados" : "Copiar"}
            </Button>
          </div>
          <label className="mt-4 flex items-center gap-2.5 text-[13px] text-[#c9ced5]">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
              className="size-[18px] flex-none accent-accent"
            />
            Guardé mis códigos en un lugar seguro
          </label>
          <Button type="button" fullWidth className="mt-4" disabled={!saved} onClick={() => router.push(ROUTES.dashboard)}>
            Terminar y entrar
          </Button>
        </div>
      )}
    </AuthCard>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5.5A1.5 1.5 0 016.5 4H15" />
    </svg>
  );
}