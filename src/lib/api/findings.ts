import { api } from "./client";
import type {
  CveResponse,
  DashboardResponse,
  FindingDetailResponse,
  FindingLifecycle,
  FindingPageResponse,
  RemediationStatus,
} from "./types";

export type FindingQuery = {
  severity?: string;
  status?: FindingLifecycle;
  asset_id?: string;
  domain_id?: string;
  scan_id?: string;
  sort?: string;
  cursor?: string;
  limit?: number;
};

export const listFindings = (query: FindingQuery = {}) => api<FindingPageResponse>("/findings", { query });
export const getFinding = (id: string) => api<FindingDetailResponse>(`/findings/${id}`);
export const updateFindingStatus = (id: string, status: RemediationStatus, reason?: string) =>
  api<FindingDetailResponse>(`/findings/${id}/status`, { method: "PATCH", body: { status, reason } });
export const getCve = (id: string) => api<CveResponse>(`/cves/${id}`);
export const getDashboard = (query: { domain_id?: string; scan_id?: string } = {}) =>
  api<DashboardResponse>("/dashboard/summary", { query });
