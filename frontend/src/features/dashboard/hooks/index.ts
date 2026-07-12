import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "../api";

// ── Dashboard Summary ──────────────────────────────────────────────────────────
export const useDashboardSummary = (company_id: string = "default") =>
  useQuery({
    queryKey: ["dashboardSummary", company_id],
    queryFn: () => dashboardApi.getSummary(company_id),
    staleTime: 30_000,
  });

// ── Notifications ──────────────────────────────────────────────────────────────
export const useNotificationsQuery = (params?: {
  page?: number;
  page_size?: number;
  is_read?: boolean;
}) =>
  useQuery({
    queryKey: ["notifications", params],
    queryFn: () => dashboardApi.getNotifications(params),
    staleTime: 30_000,
  });

export const useUnreadCountQuery = () =>
  useQuery({
    queryKey: ["notificationsUnread"],
    queryFn: () => dashboardApi.getNotifications({ page: 1, page_size: 100, is_read: false }),
    staleTime: 30_000,
    select: (res: any) => res?.data?.total ?? 0,
  });

export const useMarkNotificationReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => dashboardApi.markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notificationsUnread"] });
      qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to mark notification as read"),
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => dashboardApi.markAllNotificationsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notificationsUnread"] });
      qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast.success("All notifications marked as read");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to mark notifications as read"),
  });
};
