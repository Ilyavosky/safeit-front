"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, ErrorIcon } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; password: string; passwordConfirm: string };
type Errors = Partial<Record<keyof Fields | "terms", string>>;

function strength(value: string) {
  let score = 0;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

function validate(f: Fields, terms: boolean): Errors {
  const strongEnough = f.password.length >= 12 && /[A-Z]/.test(f.password) && /[a-z]/.test(f.password) && /\d/.test(f.password);
  return {
    name: f.name.trim() ? undefined : "Escribe tu nombre.",
    email: EMAIL_RE.test(f.email.trim()) ? undefined : "Escribe un correo válido, por ejemplo tu@correo.com.",
    password: strongEnough ? undefined : "Usa 12 caracteres o más, con mayúsculas, minúsculas y un número.",
    passwordConfirm: f.passwordConfirm && f.passwordConfirm === f.password ? undefined : "Las contraseñas no coinciden.",
    terms: terms ? undefined : "Marca la casilla para continuar: solo puedes analizar dominios propios o con permiso por escrito.",
  };
}

export function RegisterForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", password: "", passwordConfirm: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const score = strength(fields.password);
  const meterColor = score <= 1 ? "bg-[#ef5f5f]" : score === 2 ? "bg-[#e8c14b]" : "bg-[#6fd39a]";

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(validate(fields, terms));
  }

  return (
    <AuthCard title="Crear cuenta">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[13px]">
        <Input
          label="Nombre"
          name="name"
          autoComplete="name"
          placeholder="Tu nombre"
          value={fields.name}
          onChange={set("name")}
          error={errors.name}
        />
        <Input
          label="Correo"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={fields.email}
          onChange={set("email")}
          error={errors.email}
        />
        <Input
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          revealable
          value={fields.password}
          onChange={set("password")}
          error={errors.password}
          hint="Mínimo 12 caracteres, con mayúsculas, minúsculas y un número."
        >
          {fields.password && !errors.password && (
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full", i < score ? meterColor : "bg-line")} />
              ))}
            </div>
          )}
        </Input>
        <Input
          label="Confirmar contraseña"
          name="passwordConfirm"
          autoComplete="new-password"
          revealable
          value={fields.passwordConfirm}
          onChange={set("passwordConfirm")}
          error={errors.passwordConfirm}
        />

        <div>
          <label
            className={cn(
              "flex items-start gap-2.5 text-[13px] leading-snug",
              errors.terms ? "text-[#ffa3a3]" : "text-[#c9ced5]",
            )}
          >
            <input
              type="checkbox"
              name="terms"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                if (errors.terms) setErrors((er) => ({ ...er, terms: undefined }));
              }}
              className="mt-px size-[18px] flex-none accent-accent"
            />
            <span>Solo agregaré dominios propios o con permiso por escrito para analizarlos.</span>
          </label>
          {errors.terms && (
            <p className="mt-[7px] flex items-start gap-1.5 text-[13px] text-[#ff8f8f]">
              <ErrorIcon />
              <span>{errors.terms}</span>
            </p>
          )}
        </div>

        <Button type="submit" fullWidth>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href={ROUTES.login} className="text-accent hover:text-accent-hover">
          Iniciar sesión
        </Link>
      </p>
    </AuthCard>
  );
}