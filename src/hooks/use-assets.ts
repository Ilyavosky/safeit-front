"use client";

import { listAssets } from "@/lib/api/assets";
import { useApi } from "./use-api";

export function useAssets(domainId: string) {
  return useApi(() => listAssets(domainId), [domainId]);
}
