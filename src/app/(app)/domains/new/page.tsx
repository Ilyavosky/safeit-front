import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DomainForm } from "@/components/domains/domain-form";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Agregar dominio" };

export default function NewDomainPage() {
  return (
    <>
      <PageHeader
        title="Agregar dominio"
        description="Escribe el dominio y comprueba que es tuyo antes del primer escaneo."
        breadcrumb={[{ label: "Dominios", href: ROUTES.domains }, { label: "Agregar dominio" }]}
      />
      <DomainForm />
    </>
  );
}