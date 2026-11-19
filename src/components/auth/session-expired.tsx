import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { buttonClasses } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function SessionExpired() {
  return (
    <Card className="w-full max-w-[440px] rounded-[18px] border-[#2a2e35] px-7 pb-8 pt-8 text-center sm:px-9">
      <Logo className="justify-center" />
      <div className="mt-[22px] flex justify-center">
        <span className="grid size-16 place-items-center rounded-[18px] bg-[#232b45] text-[#a9bbff]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2M9.5 2.5h5" />
          </svg>
        </span>
      </div>
      <h1 className="mt-[18px] text-2xl font-semibold tracking-[-0.02em]">Tu sesión expiró</h1>
      <p className="mt-1.5 text-sm text-muted">
        Pasó un tiempo sin actividad y cerramos la sesión para proteger tu cuenta. Tus datos siguen guardados.
      </p>
      <Link href={ROUTES.login} className={buttonClasses("primary", "mt-6 w-full")}>
        Volver a entrar
      </Link>
      <p className="mt-4 text-[13px] text-[#80878f]">Tendrás que escribir tu contraseña y tu código de MFA.</p>
    </Card>
  );
}