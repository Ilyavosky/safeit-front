"use client";

import { listAssets } from "@/lib/api/assets";
import { useApi } from "./use-api";

export function useAssets(domainName?: string) {
  return useApi(() => listAssets(domainName), [domainName]);
}
