import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ROUTES } from "@/constants/routes";

export function Topbar() {
  return (
    <header className="flex h-[68px] flex-none items-center gap-3.5 border-b border-[#262a30] px-5 sm:px-8">
      <MobileNav />
        <Link href={ROUTES.dashboard} className="lg:hidden" aria-label="SafeIT, ir al inicio">
          <Logo />
        </Link>

      <label className="hidden h-[42px] w-[380px] items-center gap-2.5 rounded-xl border border-line bg-[#1b1e23] px-3.5 text-[#80878f] focus-within:border-accent sm:flex">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
        <span className="sr-only">Buscar</span>
        <input
          type="search"
          placeholder="Buscar dominio, activo o CVE"
          className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-[#80878f] focus:outline-none"
        />
        <kbd className="rounded-md border border-line px-1.5 font-sans text-xs leading-5 text-[#80878f]">Ctrl K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Notificaciones"
          className="grid size-[42px] place-items-center rounded-xl border border-line bg-[#1b1e23] text-[#c9ced5] hover:bg-line"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z" />
            <path d="M10 20a2 2 0 004 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}