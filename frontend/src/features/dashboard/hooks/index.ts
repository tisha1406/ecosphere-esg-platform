import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "../api";

// ── Dashboard Summary ──────────────────────────────────────────────────────────
// Fires all backend sub-queries in parallel (asyncio.gather on server side).
// No sequential waterfall on the client either — single API call.
export const useDashboardSummary = (company_id: string = "default") =>
  useQuery({
    queryKey: ["dashboardSummary", company_id],
    queryFn: () => dashboardApi.getSummary(company_id),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 min
    staleTime: 60_000,
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
    refetchInterval: 30_000, // Poll every 30s for live unread count
  });

export const useUnreadCountQuery = () =>
  useQuery({
    queryKey: ["notificationsUnread"],
    queryFn: () => dashboardApi.getNotifications({ is_read: false, page: 1, page_size: 1 }),
    refetchInterval: 30_000,
    select: (res) => (res.data?.data?.total as number) ?? 0,
  });

export const useMarkNotificationReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dashboardApi.markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notificationsUnread"] });
      qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to mark notification as read"),
  });
};
