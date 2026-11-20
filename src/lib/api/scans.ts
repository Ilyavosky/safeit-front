import { api } from "./client";
import type { ScanResponse } from "./types";

export const getScan = (id: string) => api<ScanResponse>(`/scans/${id}`);
