import { Badge } from "@/components/ui/badge";
import type { PublicAnalysisResponse } from "@/lib/api/types";

const STATUS: Record<PublicAnalysisResponse["status"], { label: string; className: string }> = {
  queued: { label: "En cola", className: "bg-[#2a2e35] text-[#c9ced5]" },
  running: { label: "Analizando", className: "bg-[#1f2a44] text-[#8ea6ff]" },
  done: { label: "Listo", className: "bg-[#1c3a2c] text-[#6fcf97]" },
  failed: { label: "Falló", className: "bg-[#3a1f1f] text-[#ff8f8f]" },
};

export function PublicAnalysisStatus({ status }: { status: PublicAnalysisResponse["status"] }) {
  const { label, className } = STATUS[status];
  return (
    <Badge dot className={className}>
      {label}
    </Badge>
  );
}
