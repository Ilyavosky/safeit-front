"use client";

import { ErrorNotice } from "@/components/common/error-notice";
import { FindingsTable } from "@/components/findings/findings-table";
import { useApi } from "@/hooks/use-api";
import { useCveInfo } from "@/hooks/use-findings";
import { listFindings } from "@/lib/api/findings";
import { toFinding } from "@/lib/api/mappers";
import type { FindingDetailResponse } from "@/lib/api/types";

const MAX_PAGES = 5;

async function loadAll(): Promise<FindingDetailResponse[]> {
  const all: FindingDetailResponse[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < MAX_PAGES; i++) {
    const page = await listFindings({ sort: "priority", limit: 100, cursor });
    all.push(...page.items);
    if (!page.next_cursor) break;
    cursor = page.next_cursor;
  }
  return all;
}

export function FindingsView() {
  const { data, error, reload } = useApi(loadAll);
  const cve = useCveInfo(data?.map((f) => f.cve_ids[0]) ?? []);
  const rows = data?.map((f) => toFinding(f, cve[f.cve_ids[0]]));

  return (
    <>
      <ErrorNotice error={error} onRetry={reload} />
      <FindingsTable findings={rows} />
    </>
  );
}
