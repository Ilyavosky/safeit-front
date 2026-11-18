export const FINDING_STATUSES = ["discovered", "analyzing", "confirmed", "remediating", "resolved", "false_positive"] as const;
export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  discovered: "Descubierto",
  analyzing: "En análisis (IA)",
  confirmed: "Confirmado",
  remediating: "En remediación",
  resolved: "Resuelto",
  false_positive: "Falso positivo",
};

export const FINDING_STATUS_COLOR: Record<FindingStatus, string> = {
  discovered: "#b4bac2",
  analyzing: "#a9bbff",
  confirmed: "#ff9a6b",
  remediating: "#f0cd6a",
  resolved: "#6fd39a",
  false_positive: "#7f8792",
};