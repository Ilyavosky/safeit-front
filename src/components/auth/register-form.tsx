import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "./auth-card";
import { ROUTES } from "@/constants/routes";

export function RegisterForm() {
  return (
    <AuthCard title="Registrarse">
      <form noValidate className="flex flex-col gap-[18px]">
        <Input label="Correo" type="email" name="email" autoComplete="email" placeholder="tu@correo.com" />
        <Input label="Confirmar correo" type="email" name="emailConfirm" autoComplete="email" placeholder="tu@correo.com" />
        <Input
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          revealable
          hint="Mínimo 12 caracteres, con mayúsculas, minúsculas y un número."
        />
        <Input label="Confirmar contraseña" name="passwordConfirm" autoComplete="new-password" revealable />

        {/* TODO: conectar con POST /auth/register cuando exista el backend */}
        <Button type="button" fullWidth className="mt-1.5">
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Tienes cuenta?{" "}
        <Link href={ROUTES.login} className="text-accent underline underline-offset-4 hover:text-accent-hover">
          Iniciar sesión
        </Link>
      </p>
    </AuthCard>
  );
}