import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../shared/lib/api-client";
import { toast } from "sonner";
import { EsgConfigFormValues, NotificationsFormValues } from "./schema";

export interface CompanySettingRead {
  id: string;
  company_name: string;
  carbon_target: number;
  water_target: number;
  waste_target: number;
  diversity_target: number;
  governance_target: number;
  low_score_threshold: number;
  medium_score_threshold: number;
  notification_email_alerts: boolean;
  notification_weekly_reports: boolean;
}

export function useCompanySettings() {
  return useQuery<CompanySettingRead>({
    queryKey: ["settings"],
    queryFn: async () => {
      return apiClient.get("/api/v1/settings");
    },
  });
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CompanySettingRead>) => {
      return apiClient.put("/api/v1/settings", data);
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}

// Users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => apiClient.get("/api/v1/auth/users"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.patch(`/api/v1/auth/users/${id}`, data);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => apiClient.get("/api/v1/master/departments"),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => apiClient.post("/api/v1/master/departments", data),
    onSuccess: () => {
      toast.success("Department created");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => apiClient.patch(`/api/v1/master/departments/${id}`, data),
    onSuccess: () => {
      toast.success("Department updated");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/api/v1/master/departments/${id}`),
    onSuccess: () => {
      toast.success("Department deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiClient.get("/api/v1/master/categories"),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => apiClient.post("/api/v1/master/categories", data),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => apiClient.patch(`/api/v1/master/categories/${id}`, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/api/v1/master/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
