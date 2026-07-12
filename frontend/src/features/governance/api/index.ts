import { apiClient } from "../../../shared/lib/api-client";
import { PolicyFormValues, AuditFormValues, BoardActivityFormValues } from "../schema";

export const governanceApi = {
  getPolicies: (params?: any) => apiClient.get("/api/v1/governance/policies", { params }),
  createPolicy: (data: PolicyFormValues) => apiClient.post("/api/v1/governance/policies", data),
  updatePolicy: (id: string, data: Partial<PolicyFormValues>) => apiClient.patch(`/api/v1/governance/policies/${id}`, data),
  deletePolicy: (id: string) => apiClient.delete(`/api/v1/governance/policies/${id}`),

  getAudits: (params?: any) => apiClient.get("/api/v1/governance/audits", { params }),
  createAudit: (data: AuditFormValues) => apiClient.post("/api/v1/governance/audits", data),
  updateAudit: (id: string, data: Partial<AuditFormValues>) => apiClient.patch(`/api/v1/governance/audits/${id}`, data),
  deleteAudit: (id: string) => apiClient.delete(`/api/v1/governance/audits/${id}`),

  getBoardActivities: (params?: any) => apiClient.get("/api/v1/governance/board-activity", { params }),
  createBoardActivity: (data: BoardActivityFormValues) => apiClient.post("/api/v1/governance/board-activity", data),
  updateBoardActivity: (id: string, data: Partial<BoardActivityFormValues>) => apiClient.patch(`/api/v1/governance/board-activity/${id}`, data),
  deleteBoardActivity: (id: string) => apiClient.delete(`/api/v1/governance/board-activity/${id}`),

  getGovernanceScore: (params: { start_date: string, end_date: string }) => 
    apiClient.get("/api/v1/governance/score", { params }),
};
