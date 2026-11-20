import { api } from "./client";
import { setAccessToken } from "@/lib/auth/session";
import type { MfaChallengeResponse, MfaSetupResponse, TokenResponse, UserResponse } from "./types";

export type LoginResult = { kind: "session" } | { kind: "mfa"; mfaToken: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await api<TokenResponse | MfaChallengeResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  if ("access_token" in res) {
    setAccessToken(res.access_token);
    return { kind: "session" };
  }
  return { kind: "mfa", mfaToken: res.mfa_token };
}

export async function verifyMfa(mfaToken: string, code: string) {
  const res = await api<TokenResponse>("/auth/mfa/verify", {
    method: "POST",
    body: { mfa_token: mfaToken, code },
    auth: false,
  });
  setAccessToken(res.access_token);
}

export function register(email: string, password: string) {
  return api<UserResponse>("/auth/register", { method: "POST", body: { email, password }, auth: false });
}

export async function logout() {
  try {
    await api<void>("/auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}

export function mfaSetup() {
  return api<MfaSetupResponse>("/auth/mfa/setup", { method: "POST" });
}

export function mfaEnable(code: string) {
  return api<void>("/auth/mfa/enable", { method: "POST", body: { code } });
}

export function me() {
  return api<UserResponse>("/users/me");
}

export function updateProfile(body: { email?: string; current_password?: string; new_password?: string }) {
  return api<UserResponse>("/users/me", { method: "PATCH", body });
}
