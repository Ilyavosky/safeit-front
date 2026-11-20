"use client";

import { getDashboard } from "@/lib/api/findings";
import { listDomains } from "@/lib/api/domains";
import { toDomainSummary } from "@/lib/api/mappers";
import { useApi } from "./use-api";
import type { DomainSummary } from "@/types";

export function useDomainSummaries() {
  return useApi<DomainSummary[]>(async () => {
    const domains = await listDomains();
    return Promise.all(
      domains.map(async (d) => {
        if (d.status !== "verified") return toDomainSummary(d);
        try {
          return toDomainSummary(d, { dashboard: await getDashboard({ domain_id: d.id }) });
        } catch {
          return toDomainSummary(d);
        }
      }),
    );
  });
}
