import type { Metadata } from "next";
import { SessionExpired } from "@/components/auth/session-expired";

export const metadata: Metadata = { title: "Sesión expirada" };

export default function SessionExpiredPage() {
  return <SessionExpired />;
}