"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/constants/routes";

const LOCK_SECONDS = 60;

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MfaLocked() {
  const [left, setLeft] = useState(LOCK_SECONDS);

  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="w-full max-w-[440px] rounded-[18px] border-[#2a2e35] px-7 pb-8 pt-8 text-center sm:px-9">
      <Logo className="justify-center" />
      <div className="mt-[22px] flex justify-center">
        <span className="grid size-16 place-items-center rounded-[18px] bg-[#39321c] text-[#f0cd6a]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
            <path d="M8 10.5V7.5a4 4 0 018 0v3" />
          </svg>
        </span>
      </div>
      <h1 className="mt-[18px] text-2xl font-semibold tracking-[-0.02em]">Acceso pausado</h1>
      <p className="mt-1.5 text-sm text-muted">
        Hubo 5 códigos incorrectos seguidos. Por seguridad, espera un momento para volver a intentarlo.
      </p>

      <div className="mt-[22px]" aria-live="polite">
        <p className="text-[38px] font-bold tabular-nums tracking-[-0.02em]">{format(left)}</p>
        <p className="text-[13px] text-[#80878f]">{left > 0 ? "restantes" : "Ya puedes volver a intentarlo"}</p>
      </div>

      <div className="mt-[22px] flex items-start gap-2.5 rounded-xl border border-[#2c3550] bg-[#232b45] px-3.5 py-3 text-left text-[13.5px] text-[#b8c6ff]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7.8v.1" strokeLinecap="round" />
        </svg>
        <span>Si no fuiste tú, cambia tu contraseña en cuanto vuelvas a entrar.</span>
      </div>

      <Link
        href={ROUTES.mfa}
        className="mt-[18px] inline-flex h-[46px] w-full items-center justify-center rounded-xl border border-line-strong bg-[#23272e] text-sm font-semibold text-text hover:bg-line"
      >
        Intentar de nuevo
      </Link>
      <p className="mt-4 text-sm">
        <Link href={ROUTES.login} className="text-accent hover:text-accent-hover">
          Volver al inicio de sesión
        </Link>
      </p>
    </Card>
  );
}