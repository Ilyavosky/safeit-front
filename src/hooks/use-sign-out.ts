"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/lib/api/auth";

export function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
    } catch {
    } finally {
      router.replace(ROUTES.login);
      router.refresh();
    }
  }

  return { signOut, signingOut };
}