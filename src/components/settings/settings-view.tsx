"use client";

import { useSession } from "@/hooks/use-session";
import { ProfileForm } from "./profile-form";

export function SettingsView() {
  const { user } = useSession();
  return <ProfileForm email={user?.email} mfaEnabled={user?.mfa_enabled} />;
}
