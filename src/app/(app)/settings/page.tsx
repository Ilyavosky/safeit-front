import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata: Metadata = { title: "Configuración" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Configuración" description="Tu perfil, la seguridad de tu cuenta y los avisos que recibes." />
      <ProfileForm />
    </>
  );
}