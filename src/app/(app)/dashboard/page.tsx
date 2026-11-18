import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Inicio" };

export default function DashboardPage() {
  return <PageHeader title="Inicio" description="Resumen de tus dominios y hallazgos." />;
}