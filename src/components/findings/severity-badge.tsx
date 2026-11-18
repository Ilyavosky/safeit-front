import { Badge } from "@/components/ui/badge";
import { SEVERITY_LABEL, type Severity } from "@/constants/severity";

export const SEVERITY_TINT: Record<Severity, string> = {
  critical: "bg-[#3d2023] text-[#ff8f8f]",
  high: "bg-[#3d2a1c] text-[#ffad70]",
  medium: "bg-[#39321c] text-[#f0cd6a]",
  low: "bg-[#1e2c3d] text-[#93bdf0]",
  info: "bg-[#2a2e35] text-[#b4bac2]",
};

export const SEVERITY_SOLID: Record<Severity, string> = {
  critical: "bg-[#ef5f5f]",
  high: "bg-[#f59145]",
  medium: "bg-[#e8c14b]",
  low: "bg-[#6aa0e0]",
  info: "bg-[#626a75]",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <Badge className={`${SEVERITY_TINT[severity]} ${className ?? ""}`}>{SEVERITY_LABEL[severity]}</Badge>;
}

export function SeverityBar({ counts, className }: { counts: Record<Severity, number>; className?: string }) {
  const order: Severity[] = ["critical", "high", "medium", "low", "info"];
  const total = order.reduce((sum, s) => sum + counts[s], 0);
  if (total === 0) {
    return <div className={`h-2 rounded bg-line ${className ?? ""}`} aria-label="Sin hallazgos abiertos" />;
  }
  return (
    <div className={`flex h-2 gap-[3px] ${className ?? ""}`} role="img" aria-label={`${total} hallazgos abiertos`}>
      {order
        .filter((s) => counts[s] > 0)
        .map((s) => (
          <span key={s} className={`h-full rounded ${SEVERITY_SOLID[s]}`} style={{ flexGrow: counts[s] }} />
        ))}
    </div>
  );
}