import { z } from "zod";

// --- Notification ---
export interface NotificationRecord {
  id: string;
  user_id: string;
  message: string;
  source_table: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// --- ESG Score Trend ---
export interface EsgScoreTrend {
  current: number;
  previous: number | null;
  delta: number | null; // positive = improvement
}

export interface EsgScoreBlock {
  environmental: EsgScoreTrend;
  social: EsgScoreTrend;
  governance: EsgScoreTrend;
  overall: EsgScoreTrend;
  period: string;
}

// --- Activity Counts ---
export interface ActivityCounts {
  open_policies: number;
  pending_audits: number;
  active_csr_initiatives: number;
  emissions_this_month_tco2e: number;
}

// --- Leaderboard (compact) ---
export interface LeaderboardEntryCompact {
  user_id: string;
  full_name: string;
  total_points: number;
}

// --- Dashboard Summary ---
export interface DashboardSummary {
  scores: EsgScoreBlock;
  activity: ActivityCounts;
  top_contributors: LeaderboardEntryCompact[];
  recent_notifications: NotificationRecord[];
}
