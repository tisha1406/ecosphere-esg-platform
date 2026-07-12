import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "../api";
import { mockDashboardSummary } from "../mock";

const demoNotifications = mockDashboardSummary.recent_notifications;

// ── Dashboard Summary ──────────────────────────────────────────────────────────
// Fires all backend sub-queries in parallel (asyncio.gather on server side).
// No sequential waterfall on the client either — single API call.
export const useDashboardSummary = (company_id: string = "default") =>
  useQuery({
    queryKey: ["dashboardSummary", company_id],
    queryFn: async () => ({ data: { data: mockDashboardSummary } }),
    initialData: { data: { data: mockDashboardSummary } },
    staleTime: Infinity,
  });

// ── Notifications ──────────────────────────────────────────────────────────────
export const useNotificationsQuery = (params?: {
  page?: number;
  page_size?: number;
  is_read?: boolean;
}) =>
  useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => ({
      data: {
        data: {
          items: typeof params?.is_read === "boolean"
            ? demoNotifications.filter((item) => item.is_read === params.is_read)
            : demoNotifications,
          total: typeof params?.is_read === "boolean"
            ? demoNotifications.filter((item) => item.is_read === params.is_read).length
            : demoNotifications.length,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? demoNotifications.length,
        },
      },
    }),
    initialData: {
      data: {
        data: {
          items: typeof params?.is_read === "boolean"
            ? demoNotifications.filter((item) => item.is_read === params.is_read)
            : demoNotifications,
          total: typeof params?.is_read === "boolean"
            ? demoNotifications.filter((item) => item.is_read === params.is_read).length
            : demoNotifications.length,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? demoNotifications.length,
        },
      },
    },
    staleTime: Infinity,
  });

export const useUnreadCountQuery = () =>
  useQuery({
    queryKey: ["notificationsUnread"],
    queryFn: async () => ({
      data: {
        data: {
          items: demoNotifications.filter((item) => !item.is_read),
          total: demoNotifications.filter((item) => !item.is_read).length,
          page: 1,
          page_size: 1,
        },
      },
    }),
    initialData: {
      data: {
        data: {
          items: demoNotifications.filter((item) => !item.is_read),
          total: demoNotifications.filter((item) => !item.is_read).length,
          page: 1,
          page_size: 1,
        },
      },
    },
    staleTime: Infinity,
    select: (res) => (res.data?.data?.total as number) ?? 0,
  });

export const useMarkNotificationReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
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
    mutationFn: async () => ({ ok: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notificationsUnread"] });
      qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast.success("All notifications marked as read");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to mark notifications as read"),
  });
};
