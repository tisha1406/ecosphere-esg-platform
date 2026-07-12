import type { BadgeRecord, LeaderboardEntry, PointsHistoryEntry } from "./schema";

export type ChallengeStatus = "Draft" | "Active" | "Under Review" | "Completed" | "Archived";

export interface ChallengeCard {
  id: string;
  title: string;
  xp: number;
  difficulty: "Easy" | "Medium" | "Hard";
  deadline: string;
  status: ChallengeStatus;
  category: string;
  description: string;
  participants: string;
  accent: string;
}

export interface RewardCard {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
}

export const mockChallenges: ChallengeCard[] = [
  {
    id: "c-1",
    title: "Sustainability Sprint",
    xp: 200,
    difficulty: "Hard",
    deadline: "07/20",
    status: "Active",
    category: "Energy",
    description: "Log three verified energy-saving actions and submit the monthly impact summary.",
    participants: "18 members",
    accent: "border-orange-500/80",
  },
  {
    id: "c-2",
    title: "Recycle Challenge",
    xp: 80,
    difficulty: "Easy",
    deadline: "07/15",
    status: "Active",
    category: "Waste",
    description: "Record office recycling activity for five consecutive workdays.",
    participants: "27 members",
    accent: "border-orange-500/80",
  },
  {
    id: "c-3",
    title: "Commute Green Week",
    xp: 120,
    difficulty: "Medium",
    deadline: "07/25",
    status: "Draft",
    category: "Travel",
    description: "Share low-carbon commute logs across one full week.",
    participants: "12 members",
    accent: "border-orange-500/80",
  },
];

export const mockRewardCards: RewardCard[] = [
  {
    id: "r-1",
    title: "Carbon Coach Session",
    cost: 1200,
    description: "One-to-one session on reducing emissions in your team workflow.",
    icon: "🌍",
  },
  {
    id: "r-2",
    title: "Team Lunch Voucher",
    cost: 800,
    description: "Redeem points for a team lunch voucher after completing challenges.",
    icon: "🍱",
  },
  {
    id: "r-3",
    title: "Sustainability Swag Pack",
    cost: 500,
    description: "Reusable bottle, notebook, and badge stickers for top contributors.",
    icon: "🎁",
  },
];

export const mockBadgeRecords: BadgeRecord[] = [
  {
    id: "bd-1",
    name: "Green Beginner",
    criteria: "Complete your first ESG challenge",
    icon: "star.png",
    points_value: 100,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "bd-2",
    name: "Sustainability Champion",
    criteria: "Earn 1000 points across modules",
    icon: "zap.png",
    points_value: 1000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "bd-3",
    name: "Team Player",
    criteria: "Participate in 5 team challenges",
    icon: "star.png",
    points_value: 1500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const mockLeaderboardEntries: LeaderboardEntry[] = [
  { user_id: "u-1", full_name: "Manufacturing Dept", total_points: 4820 },
  { user_id: "u-2", full_name: "Aditi Rao", total_points: 3910 },
  { user_id: "u-3", full_name: "Corporate Dept", total_points: 3505 },
  { user_id: "u-4", full_name: "Nina Gomez", total_points: 2990 },
  { user_id: "u-5", full_name: "Operations Dept", total_points: 2800 },
];

export const mockPointsHistory: PointsHistoryEntry[] = [
  {
    id: "ph-1",
    points: 200,
    reason: "Joined Sustainability Sprint",
    source_table: "challenges",
    source_id: "c-1",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ph-2",
    points: 80,
    reason: "Completed Recycle Challenge task",
    source_table: "challenges",
    source_id: "c-2",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ph-3",
    points: 150,
    reason: "Unlocked Green Beginner badge",
    source_table: "badges",
    source_id: "bd-1",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
