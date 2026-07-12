import { apiClient } from "../../../shared/lib/api-client";
import { WellbeingFormValues, CsrFormValues, DiversityFormValues } from "../schema";

export const socialApi = {
  // Wellbeing
  getWellbeing: (params?: any) =>
    apiClient.get("/api/v1/social/wellbeing", { params }),
  createWellbeing: (data: WellbeingFormValues) =>
    apiClient.post("/api/v1/social/wellbeing", data),
  updateWellbeing: (id: string, data: Partial<WellbeingFormValues>) =>
    apiClient.patch(`/api/v1/social/wellbeing/${id}`, data),
  deleteWellbeing: (id: string) =>
    apiClient.delete(`/api/v1/social/wellbeing/${id}`),

  // CSR Initiatives
  getCsrInitiatives: (params?: any) =>
    apiClient.get("/api/v1/social/csr", { params }),
  createCsrInitiative: (data: CsrFormValues) =>
    apiClient.post("/api/v1/social/csr", data),
  updateCsrInitiative: (id: string, data: Partial<CsrFormValues>) =>
    apiClient.patch(`/api/v1/social/csr/${id}`, data),
  deleteCsrInitiative: (id: string) =>
    apiClient.delete(`/api/v1/social/csr/${id}`),

  // Diversity Metrics
  getDiversityMetrics: (params?: any) =>
    apiClient.get("/api/v1/social/diversity", { params }),
  createDiversityMetric: (data: DiversityFormValues) =>
    apiClient.post("/api/v1/social/diversity", data),
  updateDiversityMetric: (id: string, data: Partial<DiversityFormValues>) =>
    apiClient.patch(`/api/v1/social/diversity/${id}`, data),
  deleteDiversityMetric: (id: string) =>
    apiClient.delete(`/api/v1/social/diversity/${id}`),

  // Score
  getSocialScore: (params: { company_id: string; start_date: string; end_date: string }) =>
    apiClient.get("/api/v1/social/score", { params }),
};
