import { z } from "zod";

// --- Badge ---
export const badgeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  criteria: z.string().min(1, "Criteria is required"),
  icon: z.string().min(1, "Icon is required").max(255),
  points_value: z.coerce.number().int().min(0, "Must be >= 0"),
});
export type BadgeFormValues = z.infer<typeof badgeSchema>;

export const badgeUpdateSchema = badgeSchema.partial();
export type BadgeUpdateValues = z.infer<typeof badgeUpdateSchema>;

// --- Award Points (admin only) ---
export const awardPointsSchema = z.object({
  user_id: z.string().uuid("Must be a valid user UUID"),
  points: z.coerce.number().int(),
  reason: z.string().min(1, "Reason is required").max(255),
});
export type AwardPointsValues = z.infer<typeof awardPointsSchema>;

// --- Read Types ---
export interface BadgeRecord {
  id: string;
  name: string;
  criteria: string;
  icon: string;
  points_value: number;
  is_active: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  total_points: number;
}

export interface LeaderboardResponse {
  period: string;
  limit: number;
  entries: LeaderboardEntry[];
}

export interface PointsHistoryEntry {
  id: string;
  points: number;
  reason: string;
  source_table: string;
  source_id: string;
  created_at: string;
}

export interface PointsHistoryResponse {
  user_id: string;
  total_points: number;
  history: PointsHistoryEntry[];
}
