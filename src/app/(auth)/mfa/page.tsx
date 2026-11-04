import type { Metadata } from "next";
import { MfaForm } from "@/components/auth/mfa-form";

export const metadata: Metadata = { title: "Verificación en dos pasos" };

export default function MfaPage() {
  return <MfaForm />;
}