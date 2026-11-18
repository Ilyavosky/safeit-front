import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AuditTable } from "@/components/audit/audit-table";

export const metadata: Metadata = { title: "Auditoría" };

export default function AuditPage() {
  return (
    <>
      <PageHeader
        title="Auditoría"
        description="Registro de quién hizo qué y cuándo: accesos, dominios, escaneos y cambios de estado."
      />
      <AuditTable />
    </>
  );
}