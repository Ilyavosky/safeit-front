import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";

export function LoginForm() {
  return (
    <AuthCard title="Iniciar sesión">
      <form noValidate className="flex flex-col gap-[18px]">
        <Input label="Correo" type="email" name="email" autoComplete="email" placeholder="tu@correo.com" />
        <Input
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          revealable
          labelAside={
            <a href="#" className="text-[12.5px] text-muted underline-offset-4 hover:text-text hover:underline">
              ¿La olvidaste?
            </a>
          }
        />

        {/* TODO: conectar con POST /auth/login cuando exista el backend */}
        <Button type="button" fullWidth className="mt-1.5">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href={ROUTES.register} className="text-accent underline underline-offset-4 hover:text-accent-hover">
          Crear cuenta
        </Link>
      </p>
    </AuthCard>
  );
}