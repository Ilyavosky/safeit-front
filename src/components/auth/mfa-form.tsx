"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorIcon } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { verifyMfa } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { MFA_TOKEN_KEY } from "./login-form";

export function MfaForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem(MFA_TOKEN_KEY)) router.replace(ROUTES.login);
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Escribe los 6 dígitos del código.");
      return;
    }
    const token = sessionStorage.getItem(MFA_TOKEN_KEY);
    if (!token) {
      router.replace(ROUTES.login);
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await verifyMfa(token, code);
      sessionStorage.removeItem(MFA_TOKEN_KEY);
      router.replace(ROUTES.dashboard);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        router.replace(ROUTES.mfaLocked);
        return;
      }
      setError(err instanceof ApiError ? err.message : "No pudimos verificar el código.");
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Verificación en dos pasos" description="Escribe el código de 6 dígitos de tu app de autenticación.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="mfa-code" className="sr-only">
            Código de 6 dígitos
          </label>
          <input
            id="mfa-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              if (error) setError(undefined);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby="mfa-message"
            className={cn(
              "h-14 w-full rounded-xl border bg-field pl-3 text-center text-[26px] tracking-[12px] text-text placeholder:text-[#4a515c] focus:outline-none",
              error ? "border-[#ef5f5f] focus:shadow-focus-danger" : "border-line focus:border-accent focus:shadow-focus",
            )}
          />
          {error ? (
            <p id="mfa-message" role="alert" className="mt-[7px] flex items-start justify-center gap-1.5 text-[13px] text-[#ff8f8f]">
              <ErrorIcon />
              <span>{error}</span>
            </p>
          ) : (
            <p id="mfa-message" className="mt-[7px] text-center text-[12.5px] text-[#80878f]">
              El código cambia cada 30 segundos.
            </p>
          )}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Verificar
        </Button>
      </form>

      <div className="mt-[22px] flex flex-col items-center gap-2.5 border-t border-[#262a30] pt-4 text-sm">
        <p className="text-[13px] text-muted">
          ¿Primera vez?{" "}
          <Link href={ROUTES.mfaSetup} className="text-accent hover:text-accent-hover">
            Configura MFA
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}