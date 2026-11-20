import type { PublicAnalysisResponse } from "@/lib/api/types";

export type PublicStats = {
  totalHosts: number;
  withWeb: number;
  tlsValid: number;
  tlsInvalid: number;
  tlsExpiringSoon: number;
  withoutHsts: number;
  truncated: boolean;
  providers: string[];
  byKind: Record<string, number>;
  dns: { nameservers: string[]; mailHosts: string[]; spf: boolean; dmarc: boolean; caa: boolean };
};

const num = (v: unknown) => (typeof v === "number" ? v : 0);
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export function readStats(raw: PublicAnalysisResponse["stats"]): PublicStats {
  const dns = (raw.dns ?? {}) as Record<string, unknown>;
  const byKind = (raw.by_kind ?? {}) as Record<string, unknown>;
  return {
    totalHosts: num(raw.total_hosts),
    withWeb: num(raw.with_web),
    tlsValid: num(raw.tls_valid),
    tlsInvalid: num(raw.tls_invalid),
    tlsExpiringSoon: num(raw.tls_expiring_soon),
    withoutHsts: num(raw.without_hsts),
    truncated: raw.truncated === true,
    providers: strings(raw.providers),
    byKind: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, num(v)])),
    dns: {
      nameservers: strings(dns.nameservers),
      mailHosts: strings(dns.mail_hosts),
      spf: dns.spf === true,
      dmarc: dns.dmarc === true,
      caa: dns.caa === true,
    },
  };
}
