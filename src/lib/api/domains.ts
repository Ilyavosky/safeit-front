import { api } from "./client";
import type { DomainResponse, ScanResponse, VerificationMethod } from "./types";

export const listDomains = () => api<DomainResponse[]>("/domains");
export const getDomain = (id: string) => api<DomainResponse>(`/domains/${id}`);
export const createDomain = (name: string, verification_method: VerificationMethod) =>
  api<DomainResponse>("/domains", { method: "POST", body: { name, verification_method } });
export const deleteDomain = (id: string) => api<void>(`/domains/${id}`, { method: "DELETE" });
export const verifyDomain = (id: string) => api<DomainResponse>(`/domains/${id}/verify`, { method: "POST" });
export const startRecon = (id: string) => api<ScanResponse>(`/domains/${id}/scans`, { method: "POST" });
export const startTests = (id: string) => api<ScanResponse>(`/domains/${id}/tests`, { method: "POST" });
