"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

type Errors = { password?: string; confirm?: string };

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <AuthCard title="Enlace no válido" description="Falta el código de recuperación. Pide un enlace nuevo.">
        <Link href={ROUTES.forgotPassword} className={buttonClasses("primary", "w-full")}>
          Pedir otro enlace
        </Link>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Contraseña actualizada" description="Cerramos tus sesiones abiertas. Entra con tu nueva contraseña.">
        <Link href={ROUTES.login} className={buttonClasses("primary", "w-full")}>
          Iniciar sesión
        </Link>
      </AuthCard>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      password: password.length >= 12 ? undefined : "Usa al menos 12 caracteres.",
      confirm: confirm && confirm === password ? undefined : "Las contraseñas no coinciden.",
    };
    setErrors(next);
    setFormError(undefined);
    if (next.password || next.confirm) return;
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No pudimos cambiar la contraseña. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const expired = formError?.includes("enlace");

  return (
    <AuthCard title="Nueva contraseña" description="Elige una contraseña larga que no uses en otros sitios.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Nueva contraseña"
          name="new-password"
          autoComplete="new-password"
          revealable
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Input
          label="Confirmar contraseña"
          name="confirm-password"
          autoComplete="new-password"
          revealable
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        {formError && (
          <p role="alert" className="text-[13px] text-[#ff8f8f]">
            {formError}{" "}
            {expired && (
              <Link href={ROUTES.forgotPassword} className="text-accent hover:text-accent-hover">
                Pedir otro enlace
              </Link>
            )}
          </p>
        )}
        <Button type="submit" fullWidth className="mt-1" loading={loading}>
          Guardar contraseña
        </Button>
      </form>
    </AuthCard>
  );
}
