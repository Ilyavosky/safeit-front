import type { Metadata } from "next";
import { MfaSetup } from "@/components/settings/mfa-setup";

export const metadata: Metadata = { title: "Configurar MFA" };

export default function MfaSetupPage() {
  return <MfaSetup />;
}