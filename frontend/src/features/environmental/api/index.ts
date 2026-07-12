import { apiClient } from "../../../shared/lib/api-client";
import { EmissionFormValues, EnergyFormValues, WasteFormValues } from "../schema";

export const environmentalApi = {
  getEmissions: (params?: any) => apiClient.get("/api/v1/environmental/emissions", { params }),
  createEmission: (data: EmissionFormValues) => apiClient.post("/api/v1/environmental/emissions", data),
  updateEmission: (id: string, data: Partial<EmissionFormValues>) => apiClient.patch(`/api/v1/environmental/emissions/${id}`, data),
  deleteEmission: (id: string) => apiClient.delete(`/api/v1/environmental/emissions/${id}`),

  getEnergy: (params?: any) => apiClient.get("/api/v1/environmental/energy", { params }),
  createEnergy: (data: EnergyFormValues) => apiClient.post("/api/v1/environmental/energy", data),
  updateEnergy: (id: string, data: Partial<EnergyFormValues>) => apiClient.patch(`/api/v1/environmental/energy/${id}`, data),
  deleteEnergy: (id: string) => apiClient.delete(`/api/v1/environmental/energy/${id}`),

  getWaste: (params?: any) => apiClient.get("/api/v1/environmental/waste", { params }),
  createWaste: (data: WasteFormValues) => apiClient.post("/api/v1/environmental/waste", data),
  updateWaste: (id: string, data: Partial<WasteFormValues>) => apiClient.patch(`/api/v1/environmental/waste/${id}`, data),
  deleteWaste: (id: string) => apiClient.delete(`/api/v1/environmental/waste/${id}`),

  getEnvironmentalScore: (params: { company_id: string, start_date: string, end_date: string }) => 
    apiClient.get("/api/v1/environmental/score", { params }),
};
