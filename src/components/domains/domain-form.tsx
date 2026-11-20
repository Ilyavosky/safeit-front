"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input, ErrorIcon } from "@/components/ui/input";
import { Button, buttonClasses } from "@/components/ui/button";
import { VerificationInstructions } from "@/components/domains/verification-instructions";
import { VerificationStatus } from "@/components/domains/verification-status";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/constants/routes";
import { createDomain, verifyDomain } from "@/lib/api/domains";
import { ApiError } from "@/lib/api/client";
import { verificationToProps } from "@/components/domains/verification-props";
import type { DomainResponse } from "@/lib/api/types";
import type { VerificationFile, VerificationMethod, VerificationRecord } from "@/types";

const DOMAIN_RE = /^(?!-)(?:[a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$/;

function cleanDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export function DomainForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState<VerificationMethod>("dns");
  const [created, setCreated] = useState<DomainResponse>();
  const [record, setRecord] = useState<VerificationRecord>();
  const [file, setFile] = useState<VerificationFile>();
  const [status, setStatus] = useState<"pending" | "verified" | "failed">("pending");
  const [checkedAt, setCheckedAt] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [domain, setDomain] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [errors, setErrors] = useState<{ domain?: string; authorized?: string }>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = cleanDomain(domain);
    const next: typeof errors = {};
    if (!value) next.domain = "Escribe el dominio que quieres agregar.";
    else if (!DOMAIN_RE.test(value)) next.domain = "Escribe un dominio válido, por ejemplo midominio.com.";
    if (!authorized) next.authorized = "Necesitas confirmar que tienes permiso para analizarlo.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setDomain(value);
    setFormError(undefined);
    setSubmitting(true);
    try {
      const res = await createDomain(value, method === "dns" ? "dns_txt" : "file");
      const props = verificationToProps(res);
      setCreated(res);
      setRecord(props.record);
      setFile(props.file);
      setStatus(res.status === "verified" ? "verified" : "pending");
      setStep(2);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No pudimos agregar el dominio.");
    } finally {
      setSubmitting(false);
    }
  }

  async function verify() {
    if (!created) return;
    setVerifying(true);
    try {
      const res = await verifyDomain(created.id);
      setStatus(res.status === "verified" ? "verified" : "failed");
    } catch (err) {
      setStatus("failed");
      setFormError(err instanceof ApiError ? err.message : undefined);
    } finally {
      setCheckedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }));
      setVerifying(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="rounded-2xl border-[#2a2e35] px-6 py-6 sm:px-7">
        <div className="mb-6 flex items-center gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-3">
              {n > 1 && <span className={cn("h-px w-8", step >= n ? "bg-accent" : "bg-line")} />}
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-[13px] font-semibold",
                  step >= n ? "bg-accent text-accent-fg" : "bg-[#23272e] text-muted",
                )}
              >
                {n}
              </span>
              <span className={cn("text-[13.5px] font-medium", step === n ? "text-text" : "text-muted")}>
                {n === 1 ? "Dominio" : "Verificación"}
              </span>
            </div>
          ))}
        </div>

        {step === 1 ? (
          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">¿Qué dominio quieres agregar?</h2>
              <p className="mt-1 text-sm text-muted">Escaneamos el dominio y los subdominios que encontremos de forma pública.</p>
            </div>
            <Input
              label="Dominio"
              name="domain"
              placeholder="midominio.com"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                if (errors.domain) setErrors((er) => ({ ...er, domain: undefined }));
              }}
              hint="Sin https:// ni rutas. Solo el dominio principal."
              error={errors.domain}
            />
            <div>
              <p className="mb-2 text-[13px] font-medium text-[#c9ced5]">¿Cómo vas a verificarlo?</p>
              <div role="radiogroup" aria-label="Método de verificación" className="inline-flex rounded-xl border border-line bg-field p-1">
                {(
                  [
                    { id: "dns", label: "Registro DNS TXT" },
                    { id: "file", label: "Archivo en el sitio" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={method === m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "h-9 rounded-[9px] px-4 text-[13.5px] font-medium transition-colors",
                      method === m.id ? "bg-[#2a2f38] text-text" : "text-muted hover:text-text",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-field px-4 py-3.5 text-[13.5px] text-[#c9ced5]">
                <input
                  type="checkbox"
                  checked={authorized}
                  onChange={(e) => {
                    setAuthorized(e.target.checked);
                    if (errors.authorized) setErrors((er) => ({ ...er, authorized: undefined }));
                  }}
                  className="mt-px size-[18px] flex-none accent-accent"
                />
                <span>Este dominio es mío o tengo permiso por escrito de su dueño para analizarlo.</span>
              </label>
              {errors.authorized && (
                <p className="mt-[7px] flex items-start gap-1.5 text-[13px] text-[#ff8f8f]">
                  <ErrorIcon />
                  <span>{errors.authorized}</span>
                </p>
              )}
            </div>
            {formError && (
              <p role="alert" className="text-[13px] text-[#ff8f8f]">
                {formError}
              </p>
            )}
            <div className="flex justify-end">
              <Button type="submit" loading={submitting}>
                Continuar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Verifica que {domain} es tuyo</h2>
                <p className="mt-1 text-sm text-muted">Elige una de las dos formas. Solo necesitas hacer una.</p>
              </div>
              <Link href={ROUTES.domains} className="text-[13px] text-muted hover:text-text">
                Verificar después
              </Link>
            </div>
            <VerificationInstructions domain={domain} record={record} file={file} fixedMethod={method} />
            <VerificationStatus
              status={status}
              checkedAt={checkedAt}
              action={
                status === "verified" && created ? (
                  <Link href={ROUTES.domain(created.id)} className={buttonClasses("primary", "h-[42px]")}>
                    Ir al dominio
                  </Link>
                ) : (
                  <Button className="h-[42px]" onClick={verify} loading={verifying}>
                    Verificar ahora
                  </Button>
                )
              }
            />
            {status === "failed" && formError && (
              <p role="alert" className="text-[13px] text-[#ff8f8f]">
                {formError}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="h-fit rounded-2xl border-[#2a2e35] px-6 py-5">
        <h2 className="font-semibold">¿Por qué pedimos verificar?</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Solo escaneamos dominios cuya propiedad está comprobada. Así evitamos analizar sitios de otras personas sin su permiso.
        </p>
        <ul className="mt-4 space-y-3 text-[13.5px] text-[#c9ced5]">
          {[
            "El registro o archivo no cambia nada de tu sitio.",
            "Puedes borrarlo después, pero lo usamos para revisar de nuevo antes de cada escaneo.",
            "Si falla, revisa que el valor esté copiado completo.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8ea6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}