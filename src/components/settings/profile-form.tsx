"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-[#24282e] pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{description}</p>
      </div>
      <Card className="max-w-[640px] rounded-2xl border-[#2a2e35] px-6 py-5">{children}</Card>
    </section>
  );
}

function ProfileCard({ name: initialName, email: initialEmail }: { name?: string; email?: string }) {
  const [name, setName] = useState(initialName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Escribe tu nombre.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Escribe un correo válido, por ejemplo tu@correo.com.";
    setErrors(next);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Input label="Nombre" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Input
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        hint="Aquí te llegan los avisos de hallazgos críticos."
        error={errors.email}
      />
      <div className="flex justify-end pt-1">
        <Button type="submit" className="h-[42px]">
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

function PasswordCard() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err: typeof errors = {};
    if (!form.current) err.current = "Escribe tu contraseña actual.";
    if (form.next.length < 12) err.next = "Usa al menos 12 caracteres.";
    if (form.confirm !== form.next || !form.confirm) err.confirm = "Las contraseñas no coinciden.";
    setErrors(err);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Input label="Contraseña actual" name="current" revealable autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} error={errors.current} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nueva contraseña" name="new" revealable autoComplete="new-password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} error={errors.next} />
        <Input label="Confirmar" name="confirm" revealable autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />
      </div>
      <div className="flex justify-end pt-1">
        <Button type="submit" variant="secondary" className="h-[42px]">
          Cambiar contraseña
        </Button>
      </div>
    </form>
  );
}

function MfaCard({ mfaEnabled, backupLeft }: { mfaEnabled?: boolean; backupLeft?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "grid size-10 flex-none place-items-center rounded-xl",
            mfaEnabled === undefined ? "bg-[#23272e] text-muted" : mfaEnabled ? "bg-[#1c3328] text-[#6fd39a]" : "bg-[#39321c] text-[#f0cd6a]",
          )}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l7.5 3v5.5c0 4.4-3.1 8-7.5 9.5-4.4-1.5-7.5-5.1-7.5-9.5V6L12 3z" />
            <path d="M8.8 12.2l2.2 2.2 4.3-4.6" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Autenticación en dos pasos</p>
          {mfaEnabled === undefined ? (
            <Skeleton className="mt-2 w-40" />
          ) : (
            <p className="mt-0.5 text-[13.5px] text-muted">{mfaEnabled ? "Activa con tu app de autenticación." : "Desactivada. Te recomendamos activarla."}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#181b20] px-4 py-3">
        <span className="text-[13.5px] text-muted">Códigos de respaldo sin usar</span>
        {backupLeft !== undefined ? <span className="font-semibold tabular-nums">{backupLeft} de 10</span> : <Skeleton className="w-12" />}
      </div>
      <div className="flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" className="h-[42px]">
          Generar códigos nuevos
        </Button>
        <Link href={ROUTES.mfaSetup} className={buttonClasses("primary", "h-[42px]")}>
          {mfaEnabled ? "Cambiar dispositivo" : "Configurar MFA"}
        </Link>
      </div>
    </div>
  );
}

type NotificationKey = "critical" | "scanDone" | "weekly";

const NOTIFICATIONS: { key: NotificationKey; title: string; text: string }[] = [
  { key: "critical", title: "Hallazgo crítico o en CISA KEV", text: "Te avisamos en cuanto aparezca uno." },
  { key: "scanDone", title: "Escaneo terminado", text: "Cuando termina el escaneo de un dominio." },
  { key: "weekly", title: "Resumen semanal", text: "Un correo los lunes con lo pendiente." },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-11 flex-none rounded-full transition-colors", checked ? "bg-accent" : "bg-[#3a404a]")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition-[left]", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

function NotificationsCard({ initial }: { initial?: Record<NotificationKey, boolean> }) {
  const [values, setValues] = useState<Record<NotificationKey, boolean>>(initial ?? { critical: false, scanDone: false, weekly: false });

  return (
    <ul className="-my-1">
      {NOTIFICATIONS.map((n) => (
        <li key={n.key} className="flex items-center gap-4 border-t border-[#24282e] py-3.5 first:border-t-0">
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-medium">{n.title}</p>
            <p className="mt-0.5 text-[13px] text-[#80878f]">{n.text}</p>
          </div>
          <Toggle label={n.title} checked={values[n.key]} onChange={(v) => setValues({ ...values, [n.key]: v })} />
        </li>
      ))}
    </ul>
  );
}

export function ProfileForm({
  name,
  email,
  mfaEnabled,
  backupLeft,
  notifications,
}: {
  name?: string;
  email?: string;
  mfaEnabled?: boolean;
  backupLeft?: number;
  notifications?: Record<NotificationKey, boolean>;
}) {
  return (
    <div className="space-y-6">
      <Section title="Perfil" description="Tu nombre y el correo con el que entras a SafeIT.">
        <ProfileCard name={name} email={email} />
      </Section>
      <Section title="Contraseña" description="Usa una contraseña larga que no uses en otros sitios.">
        <PasswordCard />
      </Section>
      <Section title="Seguridad" description="El segundo paso protege tu cuenta aunque alguien conozca tu contraseña.">
        <MfaCard mfaEnabled={mfaEnabled} backupLeft={backupLeft} />
      </Section>
      <Section title="Notificaciones" description="Elige qué avisos quieres recibir por correo.">
        <NotificationsCard initial={notifications} />
      </Section>
      <Section title="Sesiones" description="Si perdiste un dispositivo, cierra la sesión en todos.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-muted">Tendrás que volver a entrar en este y en los demás dispositivos.</p>
          <Button variant="secondary" className="h-[42px]">
            Cerrar todas las sesiones
          </Button>
        </div>
      </Section>
    </div>
  );
}