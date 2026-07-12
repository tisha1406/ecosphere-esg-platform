import { apiClient } from "../../../shared/lib/api-client";

export interface TrendPoint {
  month: string;
  score: number;
}

export interface InitiativeSummary {
  name: string;
  impact: string;
}

export interface ContributorSummary {
  name: string;
  points: number;
}

export interface ConsolidatedReport {
  company_name: string;
  period: string;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  overall_esg_score: number;
  trend_series: TrendPoint[];
  top_initiatives: InitiativeSummary[];
  top_contributors: ContributorSummary[];
}

export const reportsApi = {
  getConsolidatedReport: async (params: { company_id: string; period: string }) => {
    return apiClient.get<any, ConsolidatedReport>("/api/v1/reports/consolidated", { params });
  },

  exportReport: async (data: { format: "pdf" | "xlsx"; company_id: string; period: string }) => {
    const response = await apiClient.post("/api/v1/reports/export", data, {
      responseType: "blob",
    });
    return response as unknown as Blob;
  },
};
