import type { Metadata } from "next";
import { MfaLocked } from "@/components/auth/mfa-locked";

export const metadata: Metadata = { title: "Acceso pausado" };

export default function MfaLockedPage() {
  return <MfaLocked />;
}