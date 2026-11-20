"use client";

import { ErrorNotice } from "@/components/common/error-notice";
import { DomainsTable } from "@/components/domains/domains-table";
import { useDomainSummaries } from "@/hooks/use-domains";

export function DomainsView() {
  const { data, error, reload } = useDomainSummaries();
  return (
    <>
      <ErrorNotice error={error} onRetry={reload} />
      <DomainsTable domains={data} />
    </>
  );
}
