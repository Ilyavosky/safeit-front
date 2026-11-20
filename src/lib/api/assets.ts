import { api } from "./client";
import type { AssetDetailResponse, AssetResponse, ScanResponse } from "./types";

export const listAssets = (domain?: string) => api<AssetResponse[]>("/assets", { query: { domain } });
export const getAsset = (id: string) => api<AssetDetailResponse>(`/assets/${id}`);
export const rescanAsset = (id: string) => api<ScanResponse>(`/assets/${id}/rescan`, { method: "POST" });
export const setWhitelist = (endpointId: string, whitelisted: boolean) =>
  api<import("./types").EndpointResponse>(`/endpoints/${endpointId}/whitelist`, { method: "PUT", body: { whitelisted } });
