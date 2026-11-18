import type { Severity } from "@/constants/severity";

export type SeverityCounts = Record<Severity, number>;

export type DomainStatus = "verified" | "scanning" | "pending" | "failed";

export type DomainSummary = {
  id: string;
  name: string;
  status: DomainStatus;
  assets: number;
  lastScan?: string;
  scanProgress?: number;
  open: SeverityCounts;
};

export type PriorityFinding = {
  id: string;
  title: string;
  asset: string;
  severity: Severity;
  cvss: number;
  kev: boolean;
};

export type RiskScore = {
  value: number;
  level: Severity;
  openFindings: number;
  totalFindings: number;
};