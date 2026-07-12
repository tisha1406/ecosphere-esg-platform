export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export enum Role {
  Admin = "admin",
  EsgManager = "esg_manager",
  EnvironmentalOfficer = "environmental_officer",
  SocialOfficer = "social_officer",
  GovernanceOfficer = "governance_officer",
  Employee = "employee",
}

export type ScoreBand = "low" | "medium" | "high";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanySetting {
  id: string;
  company_name: string;
  carbon_target: number;
  water_target: number;
  waste_target: number;
  diversity_target: number;
  governance_target: number;
  low_score_threshold: number;
  medium_score_threshold: number;
  notification_email_alerts: boolean;
  notification_weekly_reports: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PointsLedger {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  source_table: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

export interface EsgScoreSummary {
  id: string;
  company_id: string;
  period: string;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}
