"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = { email?: string; password?: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({
      email: EMAIL_RE.test(email.trim()) ? undefined : "Escribe un correo válido, por ejemplo tu@correo.com.",
      password: password ? undefined : "Escribe tu contraseña.",
    });
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

        <Button type="submit" fullWidth className="mt-1">
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