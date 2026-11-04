import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";

export function MfaForm() {
  return (
    <AuthCard
      title="Verificación en dos pasos"
      description="Ingresa el código de 6 dígitos de tu app de autenticación (TOTP)."
    >
      <form noValidate className="flex flex-col gap-[18px]">
        <div>
          <label htmlFor="mfa-code" className="sr-only">
            Código de 6 dígitos
          </label>
          <input
            id="mfa-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            aria-describedby="mfa-message"
            className="h-14 w-full rounded-lg border border-line bg-field pl-[0.5em] text-center font-mono text-[26px] tracking-[0.5em] text-text placeholder:text-muted/50 focus:border-accent focus:shadow-focus focus:outline-none"
          />
          <p id="mfa-message" className="mt-1.5 text-[12.5px] text-muted">
            El código cambia cada 30 segundos.
          </p>
        </div>

        {/* TODO: conectar con POST /auth/mfa/verify cuando exista el backend */}
        <Button type="button" fullWidth>
          Verificar
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 border-t border-line pt-5 text-sm">
        <Link href={ROUTES.settings} className="text-accent underline underline-offset-4 hover:text-accent-hover">
          Configurar MFA por primera vez
        </Link>
        <Link href={ROUTES.login} className="text-[13px] text-muted hover:text-text">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthCard>
  );
}