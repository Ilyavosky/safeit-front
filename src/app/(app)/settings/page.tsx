import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Configuración" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Configuración" description="Tu perfil, la seguridad de tu cuenta y los avisos que recibes." />
      <SettingsView />
    </>
  );
}