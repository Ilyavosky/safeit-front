export const SEVERITIES = ["critical", "high", "medium", "low", "info"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
  info: "Informativo",
};

export const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#ef5f5f",
  high: "#f59145",
  medium: "#e8c14b",
  low: "#6aa0e0",
  info: "#626a75",
};