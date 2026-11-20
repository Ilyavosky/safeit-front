import { api } from "./client";
import type { AuditChainResponse, AuditEntryResponse } from "./types";

export const listAudit = (query: { limit?: number; before_id?: number; user_id?: string; action?: string } = {}) =>
  api<AuditEntryResponse[]>("/audit", { query });
export const verifyAudit = () => api<AuditChainResponse>("/audit/verify");
