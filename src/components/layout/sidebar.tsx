"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { useSession } from "@/hooks/use-session";
import { useApi } from "@/hooks/use-api";
import { listAudit } from "@/lib/api/audit";
import { formatDateTime } from "@/lib/utils/format-date";

type NavItem = { href: string; match: string; label: string; icon: React.ReactNode };

const svg = (d: React.ReactNode) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

export const MONITOREO: NavItem[] = [
  {
    href: ROUTES.dashboard,
    match: ROUTES.dashboard,
    label: "Inicio",
    icon: svg(
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>,
    ),
  },
  {
    href: ROUTES.domains,
    match: "/domains",
    label: "Dominios",
    icon: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
      </>,
    ),
  },
  {
    href: ROUTES.publicAnalysis,
    match: ROUTES.publicAnalysis,
    label: "Análisis público",
    icon: svg(
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4-4M8.5 11h5M11 8.5v5" />
      </>,
    ),
  },
  {
    href: ROUTES.findings,
    match: "/findings",
    label: "Hallazgos",
    icon: svg(
      <>
        <path d="M12 3l9.5 16.5h-19L12 3z" />
        <path d="M12 10v4M12 17.2v.1" />
      </>,
    ),
  },
];

export const SEGUIMIENTO: NavItem[] = [
  {
    href: ROUTES.report("ultimo"),
    match: "/reports",
    label: "Reportes",
    icon: svg(
      <>
        <path d="M14 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8l-5-5z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </>,
    ),
  },
  {
    href: ROUTES.audit,
    match: ROUTES.audit,
    label: "Auditoría",
    icon: svg(<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />),
  },
  {
    href: ROUTES.settings,
    match: ROUTES.settings,
    label: "Configuración",
    icon: svg(
      <>
        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="17" r="2" />
      </>,
    ),
  },
];

export function NavGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="mb-2 mt-[26px] px-3 text-xs font-medium text-[#7f8792]">{title}</p>
      <nav aria-label={title} className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.match || pathname.startsWith(`${item.match}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] font-medium transition-colors",
                active ? "bg-[#242a3a] text-white" : "text-[#a8aeb7] hover:bg-[#1f2228] hover:text-text",
              )}
            >
              <span className={cn("flex-none", active ? "text-accent" : "text-[#7f8792] group-hover:text-[#a8aeb7]")}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, ready } = useSession();
  const lastScan = useApi(ready && user ? async () => (await listAudit({ action: "scan.recon_finished", limit: 1 }))[0] ?? null : null, [ready, user?.id]);
  const userName = user?.email;
  const initial = userName?.trim().charAt(0).toUpperCase();
  const scanLoading = !ready || (user !== null && lastScan.loading);
  const scanText = lastScan.data ? formatDateTime(lastScan.data.created_at) : "Aún no hay escaneos";

  return (
    <aside className="hidden h-screen flex-col border-r border-[#262a30] bg-[#17191d] px-4 pb-[18px] pt-[22px] lg:sticky lg:top-0 lg:flex">
      <Link href={ROUTES.dashboard} className="px-1.5" aria-label="SafeIT, ir al inicio">
        <Logo />
      </Link>

      <NavGroup title="Monitoreo" items={MONITOREO} pathname={pathname} />
      <NavGroup title="Seguimiento" items={SEGUIMIENTO} pathname={pathname} />

      <div className="mt-auto rounded-[14px] border border-[#2c3550] bg-[#1f2433] p-4">
        <div className="flex items-center gap-2.5 text-[#a9bbff]">
          {svg(
            <>
              <circle cx="12" cy="12" r="8.5" />
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 12l5-5" />
            </>,
          )}
          <p className="text-sm font-semibold text-text">Último escaneo</p>
        </div>
        {scanLoading ? (
          <span className="mt-2.5 block h-2.5 w-28 rounded-full bg-[#2c3550]" aria-hidden="true" />
        ) : (
          <p className="mt-1.5 text-[13px] text-[#c3cbe6]">{scanText}</p>
        )}
      </div>

      <div className="mt-3.5 flex items-center gap-3 border-t border-[#262a30] px-2 pt-3">
        <span className="grid size-[38px] flex-none place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">
          {initial ?? svg(
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-3.5 4.4-5 8-5s6.5 1.5 8 5" />
            </>,
          )}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          {userName ? (
            <p className="truncate text-sm font-semibold" title={userName}>{userName}</p>
          ) : ready ? null : (
            <span className="block h-2.5 w-24 rounded-full bg-line" aria-hidden="true" />
          )}
        </div>
        <Link
          href={ROUTES.login}
          aria-label="Cerrar sesión"
          className="grid size-9 place-items-center rounded-lg text-[#80878f] hover:bg-[#1f2228] hover:text-text"
        >
          {svg(<path d="M15 4h3.5A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5H15M10 16l4-4-4-4M14 12H4" />)}
        </Link>
      </div>
    </aside>
  );
}