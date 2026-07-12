import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gamificationApi } from "../api";
import { BadgeFormValues, BadgeUpdateValues, AwardPointsValues } from "../schema";

// ── Badges ─────────────────────────────────────────────────
export const useBadgesQuery = (params?: any) =>
  useQuery({
    queryKey: ["badges", params],
    queryFn: () => gamificationApi.getBadges(params),
    staleTime: 30_000,
  });

export const useCreateBadgeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BadgeFormValues) => gamificationApi.createBadge(data),
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
    mutationFn: ({ id, data }: { id: string; data: BadgeUpdateValues }) => gamificationApi.updateBadge(id, data),
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
    mutationFn: (id: string) => gamificationApi.deleteBadge(id),
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
    queryFn: () => gamificationApi.getLeaderboard(params),
    staleTime: 30_000,
    ...options,
  });

// ── Points History ─────────────────────────────────────────
export const useUserPointsQuery = (userId: string) =>
  useQuery({
    queryKey: ["userPoints", userId],
    queryFn: () => gamificationApi.getUserPoints(userId),
    staleTime: 30_000,
    enabled: !!userId,
  });

// ── Award Points (admin) ───────────────────────────────────
export const useAwardPointsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AwardPointsValues) => gamificationApi.awardPoints(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      qc.invalidateQueries({ queryKey: ["userPoints"] });
      toast.success("Points awarded successfully");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to award points"),
  });
};
