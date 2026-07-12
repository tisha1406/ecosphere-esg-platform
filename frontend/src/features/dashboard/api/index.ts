import { apiClient } from "../../../shared/lib/api-client";

export const dashboardApi = {
  getSummary: (company_id: string = "default") =>
    apiClient.get("/api/v1/dashboard/summary", { params: { company_id } }),

  getNotifications: (params?: { page?: number; page_size?: number; is_read?: boolean }) =>
    apiClient.get("/api/v1/dashboard/notifications", { params }),

  markNotificationRead: (id: string) =>
    apiClient.patch(`/api/v1/dashboard/notifications/${id}/read`),
};
