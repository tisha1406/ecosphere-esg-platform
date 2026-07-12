import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gamificationApi } from "../api";
import { BadgeFormValues, BadgeUpdateValues, AwardPointsValues } from "../schema";
import { mockBadgeRecords, mockLeaderboardEntries, mockPointsHistory } from "../mock";

const mockBadgesResponse = {
  data: {
    items: mockBadgeRecords,
    total: mockBadgeRecords.length,
    page: 1,
    page_size: mockBadgeRecords.length,
  },
};

const mockLeaderboardResponse = {
  period: "all-time",
  limit: 20,
  entries: mockLeaderboardEntries,
};

const mockPointsResponse = {
  data: {
    total_points: 6015,
    history: mockPointsHistory,
  },
};

// ── Badges ─────────────────────────────────────────────────
export const useBadgesQuery = (params?: any) =>
  useQuery({
    queryKey: ["badges", params],
    queryFn: async () => mockBadgesResponse,
    initialData: mockBadgesResponse,
    staleTime: Infinity,
  });

export const useCreateBadgeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: BadgeFormValues) => ({ ok: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge created");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to create badge"),
  });
};

export const useUpdateBadgeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: BadgeUpdateValues }) => ({ ok: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge updated");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to update badge"),
  });
};

export const useDeleteBadgeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge deleted");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to delete badge"),
  });
};

// ── Leaderboard ────────────────────────────────────────────
export const useLeaderboardQuery = (params?: { period?: string; limit?: number }, options?: any) =>
  useQuery({
    queryKey: ["leaderboard", params],
    queryFn: async () => mockLeaderboardResponse,
    initialData: mockLeaderboardResponse,
    staleTime: Infinity,
    ...options,
  });

// ── Points History ─────────────────────────────────────────
export const useUserPointsQuery = (userId: string) =>
  useQuery({
    queryKey: ["userPoints", userId],
    queryFn: async () => mockPointsResponse,
    initialData: mockPointsResponse,
    staleTime: Infinity,
    enabled: !!userId,
  });

// ── Award Points (admin) ───────────────────────────────────
export const useAwardPointsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: AwardPointsValues) => ({ ok: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      qc.invalidateQueries({ queryKey: ["userPoints"] });
      toast.success("Points awarded successfully");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to award points"),
  });
};
