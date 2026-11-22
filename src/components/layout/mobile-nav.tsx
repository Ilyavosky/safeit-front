"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { MONITOREO, NavGroup, SEGUIMIENTO } from "./sidebar";
import { ROUTES } from "@/constants/routes";
import { useSignOut } from "@/hooks/use-sign-out";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, signingOut } = useSignOut();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="grid size-[42px] flex-none place-items-center rounded-xl border border-line bg-[#1b1e23] text-[#c9ced5] hover:bg-line lg:hidden"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60" />
          <div className="relative flex h-full w-[280px] max-w-[85vw] flex-col border-r border-[#262a30] bg-[#17191d] px-4 pb-5 pt-[18px]">
            <div className="flex items-center justify-between px-1.5">
              <Link href={ROUTES.dashboard} onClick={() => setOpen(false)} aria-label="SafeIT, ir al inicio">
                <Logo />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="grid size-9 place-items-center rounded-lg text-[#a0a7b0] hover:bg-[#1f2228] hover:text-text"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <NavGroup title="Monitoreo" items={MONITOREO} pathname={pathname} onNavigate={() => setOpen(false)} />
            <NavGroup title="Seguimiento" items={SEGUIMIENTO} pathname={pathname} onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              disabled={signingOut}
              className="mt-auto flex h-11 items-center gap-3 rounded-[10px] px-3 text-left text-[15px] font-medium text-[#a8aeb7] hover:bg-[#1f2228] hover:text-text disabled:opacity-50"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 4h3.5A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5H15M10 16l4-4-4-4M14 12H4" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}