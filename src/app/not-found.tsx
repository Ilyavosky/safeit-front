import Link from "next/link";
import { StatusScreen } from "@/components/layout/status-screen";
import { buttonClasses } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <StatusScreen
      code="Error 404"
      title="Esta página no existe"
      description="Puede que el enlace esté mal escrito o que el dominio o hallazgo se haya eliminado."
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4-4M9 9l4 4M13 9l-4 4" />
        </svg>
      }
    >
      <Link href={ROUTES.dashboard} className={buttonClasses("primary", "h-[42px]")}>
        Ir al inicio
      </Link>
      <Link href={ROUTES.domains} className={buttonClasses("secondary", "h-[42px]")}>
        Ver dominios
      </Link>
    </StatusScreen>
  );
}