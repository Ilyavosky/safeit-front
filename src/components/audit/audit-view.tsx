"use client";

import { Card } from "@/components/ui/card";
import { ErrorNotice } from "@/components/common/error-notice";
import { AuditTable } from "@/components/audit/audit-table";
import { useApi } from "@/hooks/use-api";
import { listAudit, verifyAudit } from "@/lib/api/audit";
import { toAuditEntry } from "@/lib/api/mappers";

export function AuditView() {
  const entries = useApi(() => listAudit({ limit: 100 }));
  const chain = useApi(() => verifyAudit().catch(() => null));

  return (
    <>
      <ErrorNotice error={entries.error} onRetry={entries.reload} />
      {chain.data && (
        <Card
          role="status"
          className={`rounded-2xl px-5 py-3 text-[13.5px] ${chain.data.intact ? "border-[#1f3a2b] text-[#6fd39a]" : "border-[#4a2a2a] text-[#ff8f8f]"}`}
        >
          {chain.data.intact
            ? "La cadena de auditoría está íntegra: ningún registro fue alterado."
            : `La cadena de auditoría está rota en el registro ${chain.data.broken_at_id}.`}
        </Card>
      )}
      <AuditTable entries={entries.data?.map(toAuditEntry)} />
    </>
  );
}
