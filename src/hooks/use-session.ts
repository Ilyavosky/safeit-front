"use client";

import { useEffect, useState } from "react";
import { me } from "@/lib/api/auth";
import { refreshSession } from "@/lib/api/client";
import { getAccessToken, onSessionChange } from "@/lib/auth/session";
import type { UserResponse } from "@/lib/api/types";

export function useSession() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!getAccessToken() && !(await refreshSession())) {
        if (!cancelled) {
          setUser(null);
          setReady(true);
        }
        return;
      }
      try {
        const profile = await me();
        if (!cancelled) setUser(profile);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void load();
    const off = onSessionChange(() => {
      if (!getAccessToken()) setUser(null);
    });
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  return { user, ready };
}
