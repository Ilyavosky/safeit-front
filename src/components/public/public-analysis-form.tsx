"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input, ErrorIcon } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/lib/api/client";
import { createPublicAnalysis } from "@/lib/api/public-analyses";

const DOMAIN_RE = /^(?!-)(?:[a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$/;

function cleanDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export function PublicAnalysisForm({ onStarted }: { onStarted?: () => void }) {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<{ domain?: string; accepted?: string }>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = cleanDomain(domain);
    const next: typeof errors = {};
    if (!value) next.domain = "Escribe el dominio que quieres analizar.";
    else if (!DOMAIN_RE.test(value)) next.domain = "Escribe un dominio válido, por ejemplo ejemplo.com.";
    if (!accepted) next.accepted = "Necesitas aceptar el aviso de uso para continuar.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setFormError(undefined);
    setSubmitting(true);
    try {
      const analysis = await createPublicAnalysis(value, true);
      onStarted?.();
      router.push(ROUTES.publicAnalysisDetail(analysis.id));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No pudimos iniciar el análisis.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="rounded-2xl border-[#2a2e35] px-6 py-6 sm:px-7">
        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">¿Qué dominio quieres conocer?</h2>
            <p className="mt-1 text-sm text-muted">
              Puede ser de cualquier organización. No necesitas verificarlo, porque solo observamos lo que cualquier visitante vería.
            </p>
          </div>
          <Input
            label="Dominio"
            name="domain"
            placeholder="ejemplo.com"
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
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-field px-4 py-3.5 text-[13.5px] text-[#c9ced5]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => {
                  setAccepted(e.target.checked);
                  if (errors.accepted) setErrors((er) => ({ ...er, accepted: undefined }));
                }}
                className="mt-px size-[18px] flex-none accent-accent"
              />
              <span>
                Entiendo que este análisis es informativo y pasivo, que quedará registrado a mi nombre y que lo usaré solo con fines legítimos.
              </span>
            </label>
            {errors.accepted && (
              <p className="mt-[7px] flex items-start gap-1.5 text-[13px] text-[#ff8f8f]">
                <ErrorIcon />
                <span>{errors.accepted}</span>
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
              Analizar dominio
            </Button>
          </div>
        </form>
      </Card>

      <Card className="h-fit rounded-2xl border-[#2a2e35] px-6 py-5">
        <h2 className="font-semibold">Qué hace y qué no</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Es una mirada superficial, parecida a visitar el sitio y revisar su registro público.
        </p>
        <ul className="mt-4 space-y-3 text-[13.5px] text-[#c9ced5]">
          {[
            "Busca subdominios en fuentes públicas.",
            "Hace una sola visita a la página principal de cada uno.",
            "Explica qué tipo de contenido parece tener cada subdominio.",
            "No prueba vulnerabilidades, no escanea puertos y no muestra direcciones IP ni versiones.",
            "El resultado se borra a los 30 días.",
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
