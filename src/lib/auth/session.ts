const HINT_COOKIE = "safeit_session";

let accessToken: string | null = null;
const listeners = new Set<() => void>();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof document !== "undefined") {
    document.cookie = token
      ? `${HINT_COOKIE}=1; path=/; max-age=604800; samesite=lax`
      : `${HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
  }
  listeners.forEach((fn) => fn());
}

export function onSessionChange(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const SESSION_HINT_COOKIE = HINT_COOKIE;
