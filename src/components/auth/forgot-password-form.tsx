"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(undefined);
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError("Escribe un correo válido, por ejemplo tu@correo.com.");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await forgotPassword(value);
      setSentTo(value);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No pudimos enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <AuthCard title="Revisa tu correo" description={`Si ${sentTo} tiene una cuenta, te enviamos un enlace para elegir una nueva contraseña.`}>
        <p className="text-center text-[13px] text-[#80878f]">
          El enlace vence en 30 minutos. Si no lo ves, revisa la carpeta de spam.
        </p>
        <Link href={ROUTES.login} className={buttonClasses("primary", "mt-6 w-full")}>
          Volver a iniciar sesión
        </Link>
        <button
          type="button"
          onClick={() => setSentTo(undefined)}
          className="mt-4 block w-full text-center text-[13px] text-muted hover:text-text"
        >
          Usar otro correo
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Recuperar contraseña" description="Escribe tu correo y te enviamos un enlace para restablecerla.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Correo"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        {formError && (
          <p role="alert" className="text-[13px] text-[#ff8f8f]">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth className="mt-1" loading={loading}>
          Enviar enlace
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        <Link href={ROUTES.login} className="text-accent hover:text-accent-hover">
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthCard>
  );
}
