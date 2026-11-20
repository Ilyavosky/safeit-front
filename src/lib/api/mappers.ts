import { SEVERITIES, type Severity } from "@/constants/severity";
import type { FindingStatus } from "@/constants/finding-status";
import { formatDate, formatDateTime } from "@/lib/utils/format-date";
import type {
  AuditEntry,
  AuditCategory,
  DomainAsset,
  DomainSummary,
  Finding,
  FindingDetail,
  PriorityFinding,
  Recommendation,
  RiskScore,
  SeverityCounts,
  AssetDetail,
  AssetService,
} from "@/types";
import type {
  AssetDetailResponse,
  AssetResponse,
  AuditEntryResponse,
  CveResponse,
  DashboardResponse,
  DomainResponse,
  FindingDetailResponse,
  FindingLifecycle,
  FindingResponse,
  RecommendationResponse,
  RemediationStatus,
  ScanResponse,
} from "./types";

export function toCounts(raw?: Record<string, number> | null): SeverityCounts {
  const out = {} as SeverityCounts;
  for (const s of SEVERITIES) out[s] = raw?.[s] ?? 0;
  return out;
}

const LIFECYCLE_TO_UI: Record<FindingLifecycle, FindingStatus> = {
  discovered: "discovered",
  in_analysis: "analyzing",
  confirmed: "confirmed",
  false_positive: "false_positive",
  in_remediation: "remediating",
  resolved: "resolved",
};

export function lifecycleToUi(status: FindingLifecycle): FindingStatus {
  return LIFECYCLE_TO_UI[status];
}

export function uiToLifecycle(status: FindingStatus): FindingLifecycle {
  const entry = Object.entries(LIFECYCLE_TO_UI).find(([, ui]) => ui === status);
  return (entry?.[0] ?? "discovered") as FindingLifecycle;
}

export function uiStatusToRemediation(status: FindingStatus): RemediationStatus {
  if (status === "resolved") return "fixed";
  if (status === "remediating") return "in_progress";
  return "open";
}

export type CveInfo = { cvss: number; epss?: number; kev: boolean };

export function toCveInfo(cve?: CveResponse | null): CveInfo | undefined {
  if (!cve) return undefined;
  return {
    cvss: cve.cvss_score ?? 0,
    epss: cve.epss_score ?? undefined,
    kev: cve.in_cisa_kev,
  };
}

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function toFinding(f: FindingResponse | FindingDetailResponse, cve?: CveInfo): Finding {
  const detail = f as Partial<FindingDetailResponse>;
  const status: FindingStatus = detail.status
    ? lifecycleToUi(detail.status)
    : f.is_false_positive
      ? "false_positive"
      : f.remediation_status === "fixed"
        ? "resolved"
        : f.remediation_status === "in_progress"
          ? "remediating"
          : "discovered";
  return {
    id: f.id,
    title: f.title,
    asset: detail.asset ?? (detail.url ? hostOf(detail.url) : f.id.slice(0, 8)),
    severity: f.severity as Severity,
    status,
    cvss: cve?.cvss ?? f.priority_score ?? 0,
    epss: cve?.epss,
    kev: cve?.kev ?? false,
    cve: f.cve_ids[0],
    detectedAt: formatDate(f.detected_at),
  };
}

export function toPriorityFinding(f: FindingDetailResponse, cve?: CveInfo): PriorityFinding {
  return {
    id: f.id,
    title: f.title,
    asset: f.asset,
    severity: f.severity as Severity,
    cvss: cve?.cvss ?? f.priority_score ?? 0,
    kev: cve?.kev ?? false,
  };
}

export function toFindingDetail(f: FindingDetailResponse, cve?: CveInfo): FindingDetail {
  return {
    ...toFinding(f, cve),
    service: f.url,
    references: f.cve_ids.map((id) => ({ label: id, url: `https://nvd.nist.gov/vuln/detail/${id}` })),
  };
}

export function riskScore(counts: SeverityCounts, total: number, openFindings: number): RiskScore {
  const raw = counts.critical * 25 + counts.high * 10 + counts.medium * 4 + counts.low;
  const value = Math.min(100, raw);
  const level: Severity =
    value >= 70 ? "critical" : value >= 40 ? "high" : value >= 15 ? "medium" : value > 0 ? "low" : "info";
  return { value, level, openFindings, totalFindings: total };
}

export function dashboardScore(d: DashboardResponse): RiskScore {
  const counts = toCounts(d.severity_counts);
  const open = d.total_findings - (d.remediation_counts.fixed ?? 0);
  return riskScore(counts, d.total_findings, Math.max(0, open));
}

export function toDomainSummary(
  d: DomainResponse,
  stats?: { dashboard?: DashboardResponse; scanning?: boolean; scanProgress?: number },
): DomainSummary {
  const dash = stats?.dashboard;
  const status: DomainSummary["status"] =
    d.status === "verified" ? (stats?.scanning ? "scanning" : "verified") : d.status === "failed" ? "failed" : "pending";
  return {
    id: d.id,
    name: d.name,
    status,
    assets: dash?.assets ?? 0,
    lastScan: undefined,
    scanProgress: stats?.scanProgress,
    open: toCounts(dash?.severity_counts),
  };
}

export function toDomainAsset(a: AssetResponse): DomainAsset {
  const isIp = a.kind === "ip";
  return {
    id: a.id,
    hostname: a.value,
    ip: isIp ? a.value : undefined,
    services: 0,
    lastScan: formatDate(a.discovered_at),
    open: toCounts(),
  };
}

export function toAssetDetail(a: AssetDetailResponse, domainName: string): AssetDetail {
  return {
    id: a.id,
    hostname: a.value,
    domainId: a.domain_id,
    domain: domainName,
    ip: a.kind === "ip" ? a.value : undefined,
    lastScan: formatDate(a.discovered_at),
    technologies: [...new Set(a.endpoints.flatMap((e) => e.technologies))],
  };
}

export function toServices(a: AssetDetailResponse): AssetService[] {
  return a.services.map((s) => ({
    port: s.port,
    protocol: s.protocol === "udp" ? "udp" : "tcp",
    service: s.name ?? "desconocido",
    version: s.version ?? undefined,
    tls: s.port === 443 || s.port === 8443,
  }));
}

export function toRecommendation(r: RecommendationResponse): Recommendation & { status: RecommendationResponse["status"] } {
  return {
    id: r.id,
    title: r.finding_title ?? r.action,
    detail: r.action,
    severity: (r.severity ?? "info") as Severity,
    findings: 1,
    status: r.status,
  };
}

function categoryOf(action: string): AuditCategory {
  const prefix = action.split(/[._:]/)[0];
  if (prefix === "auth" || prefix === "login" || prefix === "mfa" || prefix === "user") return "auth";
  if (prefix === "domain") return "domain";
  if (prefix === "scan" || prefix === "recon" || prefix === "tests") return "scan";
  if (prefix === "finding" || prefix === "recommendation") return "finding";
  return "settings";
}

export function toAuditEntry(e: AuditEntryResponse): AuditEntry {
  const detail = e.detail as Record<string, unknown>;
  return {
    id: String(e.id),
    at: formatDateTime(e.created_at) ?? e.created_at,
    actor: e.user_id ? e.user_id.slice(0, 8) : "sistema",
    category: categoryOf(e.action),
    action: e.action,
    target: e.entity ? `${e.entity}${e.entity_id ? ` ${e.entity_id.slice(0, 8)}` : ""}` : undefined,
    ip: typeof detail.ip === "string" ? detail.ip : undefined,
  };
}

export function isScanActive(scan?: Pick<ScanResponse, "status">) {
  return scan?.status === "queued" || scan?.status === "running";
}
