"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import type { VerificationFile, VerificationMethod, VerificationRecord } from "@/types";

function CopyField({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-medium text-[#80878f]">{label}</p>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-field py-1.5 pl-3.5 pr-1.5">
        <div className="min-h-[22px] min-w-0 flex-1 py-0.5">
          {value ? (
            <code className="block break-all font-mono text-[13px] text-text">{value}</code>
          ) : (
            <Skeleton className="mt-1.5 w-3/4" />
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={!value}
          className="h-[32px] flex-none rounded-lg px-3 text-[12.5px] font-medium text-muted hover:bg-line hover:text-text disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid size-6 flex-none place-items-center rounded-full bg-[#23272e] text-xs font-semibold text-muted">
      {n}
    </span>
  );
}

export function VerificationInstructions({
  domain,
  record,
  file,
  fixedMethod,
}: {
  domain?: string;
  record?: VerificationRecord;
  file?: VerificationFile;
  fixedMethod?: VerificationMethod;
}) {
  const [picked, setMethod] = useState<VerificationMethod>("dns");
  const method = fixedMethod ?? picked;

  return (
    <div>
      <div role="tablist" aria-label="Método de verificación" className={cn("inline-flex rounded-xl border border-line bg-field p-1", fixedMethod && "hidden")}>
        {(
          [
            { id: "dns", label: "Registro DNS TXT" },
            { id: "file", label: "Archivo en el sitio" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={method === tab.id}
            onClick={() => setMethod(tab.id)}
            className={cn(
              "h-9 rounded-[9px] px-4 text-[13.5px] font-medium transition-colors",
              method === tab.id ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {method === "dns" ? (
        <ol className="mt-5 space-y-5">
          <li className="flex gap-3">
            <StepNumber n={1} />
            <p className="pt-0.5 text-[14px] text-[#c9ced5]">
              Entra al panel de tu proveedor de dominio{domain ? <> de <span className="font-semibold text-text">{domain}</span></> : null} y abre la sección de DNS.
            </p>
          </li>
          <li className="flex gap-3">
            <StepNumber n={2} />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[14px] text-[#c9ced5]">Crea un registro nuevo con estos datos:</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
                <div>
                  <p className="mb-1.5 text-[12.5px] font-medium text-[#80878f]">Tipo</p>
                  <div className="flex h-[46px] items-center rounded-xl border border-line bg-field px-3.5 font-mono text-[13px]">TXT</div>
                </div>
                <CopyField label="Nombre" value={record?.name} />
              </div>
              <div className="mt-3">
                <CopyField label="Valor" value={record?.value} />
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <StepNumber n={3} />
            <p className="pt-0.5 text-[14px] text-[#c9ced5]">Guarda el registro y vuelve aquí para verificar.</p>
          </li>
        </ol>
      ) : (
        <ol className="mt-5 space-y-5">
          <li className="flex gap-3">
            <StepNumber n={1} />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[14px] text-[#c9ced5]">Crea un archivo de texto con este contenido:</p>
              <div className="mt-3">
                <CopyField label="Contenido" value={file?.content} />
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <StepNumber n={2} />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[14px] text-[#c9ced5]">Súbelo a tu sitio para que se pueda abrir en esta ruta:</p>
              <div className="mt-3">
                <CopyField label="Ruta" value={file?.path} />
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <StepNumber n={3} />
            <p className="pt-0.5 text-[14px] text-[#c9ced5]">Revisa que la ruta abra en el navegador y vuelve aquí para verificar.</p>
          </li>
        </ol>
      )}
    </div>
  );
}