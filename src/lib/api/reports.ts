import { api, apiFetch } from "./client";
import type { LatestReportResponse, RecommendationResponse, RecommendationStatus, ReportResponse } from "./types";

export const getReport = (scanId: string) => api<ReportResponse>(`/reports/${scanId}`);
export const getLatestReport = () => api<LatestReportResponse>("/reports/latest");
export const updateRecommendation = (id: string, status: RecommendationStatus) =>
  api<RecommendationResponse>(`/recommendations/${id}`, { method: "PATCH", body: { status } });

export async function downloadReportPdf(scanId: string) {
  const res = await apiFetch(`/reports/${scanId}/pdf`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-${scanId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
