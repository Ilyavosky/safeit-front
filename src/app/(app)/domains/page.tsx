import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { DomainsTable } from "@/components/domains/domains-table";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Dominios" };

export default function DomainsPage() {
  return (
    <>
      <PageHeader
        title="Dominios"
        description="Tus dominios, su estado de verificación y los hallazgos abiertos de cada uno."
        actions={
          <Link href={ROUTES.newDomain} className={buttonClasses("primary", "h-[42px]")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar dominio
          </Link>
        }
      />
      <DomainsTable />
    </>
  );
}