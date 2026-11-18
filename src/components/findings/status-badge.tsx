import { Badge } from "@/components/ui/badge";
import { FINDING_STATUS_LABEL, type FindingStatus } from "@/constants/finding-status";

export const STATUS_TINT: Record<FindingStatus, string> = {
  discovered: "bg-[#2a2e35] text-[#b4bac2]",
  analyzing: "bg-[#232b45] text-[#a9bbff]",
  confirmed: "bg-[#3d2620] text-[#ff9a6b]",
  remediating: "bg-[#39321c] text-[#f0cd6a]",
  resolved: "bg-[#1c3328] text-[#6fd39a]",
  false_positive: "bg-[#212328] text-[#7f8792]",
};

export function StatusBadge({ status, className }: { status: FindingStatus; className?: string }) {
  return (
    <Badge dot className={`${STATUS_TINT[status]} ${className ?? ""}`}>
      {FINDING_STATUS_LABEL[status]}
    </Badge>
  );
}