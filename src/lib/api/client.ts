import { getAccessToken, setAccessToken } from "@/lib/auth/session";
import { ROUTES } from "@/constants/routes";

const BASE = "/api";

export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;

  constructor(status: number, code: string, message: string, requestId?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
  auth?: boolean;
};

let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "same-origin" });
      if (!res.ok) return false;
      const data = (await res.json()) as { access_token: string };
      setAccessToken(data.access_token);
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => {
        refreshing = null;
      }, 0);
    }
  })();
  return refreshing;
}

function buildUrl(path: string, query?: Query) {
  const params = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    }
  }
  const qs = params.toString();
  return `${BASE}${path}${qs ? `?${qs}` : ""}`;
}

async function toError(res: Response) {
  let code = "http_error";
  let message = "Algo salió mal. Intenta de nuevo.";
  let requestId: string | undefined;
  try {
    const body = await res.json();
    if (typeof body?.code === "string") code = body.code;
    if (typeof body?.message === "string") message = body.message;
    if (typeof body?.request_id === "string") requestId = body.request_id;
  } catch {}
  return new ApiError(res.status, code, message, requestId);
}

function expire() {
  setAccessToken(null);
  if (typeof window !== "undefined" && window.location.pathname !== ROUTES.sessionExpired) {
    window.location.assign(ROUTES.sessionExpired);
  }
}

export async function apiFetch(path: string, options: Options = {}, retry = true): Promise<Response> {
  const { method = "GET", body, query, signal, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "network_error", "No pudimos conectar con el servidor. Revisa tu conexión.");
  }

  if (res.status === 401 && auth && retry) {
    if (await refreshSession()) return apiFetch(path, options, false);
    expire();
  }
  if (!res.ok) throw await toError(res);
  return res;
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const res = await apiFetch(path, options);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
