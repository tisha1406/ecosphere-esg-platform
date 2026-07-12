import { apiClient } from "../../../shared/lib/api-client";
import { BadgeFormValues, BadgeUpdateValues, AwardPointsValues } from "../schema";

export const gamificationApi = {
  // Badges
  getBadges: (params?: any) =>
    apiClient.get("/api/v1/gamification/badges", { params }),
  createBadge: (data: BadgeFormValues) =>
    apiClient.post("/api/v1/gamification/badges", data),
  updateBadge: (id: string, data: BadgeUpdateValues) =>
    apiClient.patch(`/api/v1/gamification/badges/${id}`, data),
  deleteBadge: (id: string) =>
    apiClient.delete(`/api/v1/gamification/badges/${id}`),

  // Leaderboard
  getLeaderboard: (params?: { period?: string; limit?: number }) =>
    apiClient.get("/api/v1/gamification/leaderboard", { params }),

  // Points History
  getUserPoints: (userId: string) =>
    apiClient.get(`/api/v1/gamification/points/${userId}`),

  // Internal: Award points (admin only)
  awardPoints: (data: AwardPointsValues) =>
    apiClient.post("/api/v1/gamification/points/award", data),
};
