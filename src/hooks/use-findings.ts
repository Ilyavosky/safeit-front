"use client";

import { useEffect, useState } from "react";
import { getCve } from "@/lib/api/findings";
import { toCveInfo, type CveInfo } from "@/lib/api/mappers";

const cache = new Map<string, Promise<CveInfo | undefined>>();

function loadCve(id: string) {
  let hit = cache.get(id);
  if (!hit) {
    hit = getCve(id)
      .then(toCveInfo)
      .catch(() => undefined);
    cache.set(id, hit);
  }
  return hit;
}

export function useCveInfo(ids: (string | undefined)[]) {
  const key = ids.filter(Boolean).join(",");
  const [info, setInfo] = useState<Record<string, CveInfo>>({});

  useEffect(() => {
    let cancelled = false;
    const unique = [...new Set(key ? key.split(",") : [])];
    Promise.all(unique.map(async (id) => [id, await loadCve(id)] as const)).then((pairs) => {
      if (cancelled) return;
      const next: Record<string, CveInfo> = {};
      for (const [id, value] of pairs) if (value) next[id] = value;
      setInfo(next);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return info;
}
