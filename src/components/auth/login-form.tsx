"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export const MFA_TOKEN_KEY = "safeit_mfa_token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = { email?: string; password?: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      email: EMAIL_RE.test(email.trim()) ? undefined : "Escribe un correo válido, por ejemplo tu@correo.com.",
      password: password ? undefined : "Escribe tu contraseña.",
    };
    setErrors(next);
    setFormError(undefined);
    if (next.email || next.password) return;
    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result.kind === "mfa") {
        sessionStorage.setItem(MFA_TOKEN_KEY, result.mfaToken);
        router.push(ROUTES.mfa);
      } else {
        router.replace(ROUTES.dashboard);
      }
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No pudimos iniciar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Iniciar sesión" description="Entra para ver el estado de tus dominios.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Correo"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          revealable
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          labelAside={
            <a href="#" className="text-[13px] text-muted hover:text-text">
              ¿La olvidaste?
            </a>
          }
        />

        {formError && (
          <p role="alert" className="text-[13px] text-[#ff8f8f]">
            {formError}
          </p>
        )}

        <Button type="submit" fullWidth className="mt-1" loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href={ROUTES.register} className="text-accent hover:text-accent-hover">
          Crear cuenta
        </Link>
      </p>
    </AuthCard>
  );
}