import { api } from "./client";
import type { PublicAnalysisDetailResponse, PublicAnalysisResponse } from "./types";

export const createPublicAnalysis = (domain: string, acceptNotice: boolean) =>
  api<PublicAnalysisResponse>("/public-analyses", {
    method: "POST",
    body: { domain, accept_notice: acceptNotice },
  });

export const listPublicAnalyses = () => api<PublicAnalysisResponse[]>("/public-analyses");

export const getPublicAnalysis = (id: string) => api<PublicAnalysisDetailResponse>(`/public-analyses/${id}`);
