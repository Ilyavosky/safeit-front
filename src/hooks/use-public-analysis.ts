"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getPublicAnalysis } from "@/lib/api/public-analyses";
import type { PublicAnalysisDetailResponse } from "@/lib/api/types";

const ACTIVE = new Set(["queued", "running"]);

export function usePublicAnalysis(analysisId: string, intervalMs = 3000) {
  const [analysis, setAnalysis] = useState<PublicAnalysisDetailResponse>();
  const [error, setError] = useState<ApiError>();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await getPublicAnalysis(analysisId);
        if (cancelled) return;
        setAnalysis(next);
        setError(undefined);
        if (ACTIVE.has(next.status)) timer = setTimeout(poll, intervalMs);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError(err);
          return;
        }
        timer = setTimeout(poll, intervalMs * 2);
      }
    }
    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [analysisId, intervalMs]);

  return { analysis, error };
}
