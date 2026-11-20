"use client";

import { useEffect, useState } from "react";
import { getScan } from "@/lib/api/scans";
import { isScanActive } from "@/lib/api/mappers";
import type { ScanResponse } from "@/lib/api/types";

export function useScanStatus(scanId?: string, onDone?: (scan: ScanResponse) => void, intervalMs = 3000) {
  const [scan, setScan] = useState<ScanResponse>();

  useEffect(() => {
    if (!scanId) {
      setScan(undefined);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await getScan(scanId as string);
        if (cancelled) return;
        setScan(next);
        if (isScanActive(next)) timer = setTimeout(poll, intervalMs);
        else onDone?.(next);
      } catch {
        if (!cancelled) timer = setTimeout(poll, intervalMs * 2);
      }
    }
    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanId, intervalMs]);

  return scan;
}
