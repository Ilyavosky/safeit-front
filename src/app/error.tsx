"use client";

import Link from "next/link";
import { StatusScreen } from "@/components/layout/status-screen";
import { Button, buttonClasses } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusScreen
      code={error.digest ? `Referencia ${error.digest}` : undefined}
      title="Algo salió mal"
      description="No pudimos cargar esta pantalla. Vuelve a intentarlo; si sigue pasando, recarga la página."
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l9.5 16.5h-19L12 3z" />
          <path d="M12 10v4M12 17.2v.1" />
        </svg>
      }
    >
      <Button className="h-[42px]" onClick={reset}>
        Reintentar
      </Button>
      <Link href={ROUTES.dashboard} className={buttonClasses("secondary", "h-[42px]")}>
        Ir al inicio
      </Link>
    </StatusScreen>
  );
}