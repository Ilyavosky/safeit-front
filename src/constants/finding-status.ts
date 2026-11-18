export const FINDING_STATUSES = [
  "discovered",
  "analyzing",
  "confirmed",
  "remediating",
  "resolved",
  "false_positive",
] as const;
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
  discovered: "#8a9099",
  analyzing: "#8ea6ff",
  confirmed: "#e0662a",
  remediating: "#d9a72e",
  resolved: "#3fa56a",
  false_positive: "#68707b",
};