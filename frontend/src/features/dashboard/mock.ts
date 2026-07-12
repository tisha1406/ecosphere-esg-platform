import { DashboardSummary } from "./schema";

export const mockDashboardSummary: DashboardSummary = {
  scores: {
    period: "Q2 2026",
    overall: {
      current: 82.4,
      previous: 78.1,
      delta: 4.3,
    },
    environmental: {
      current: 86.7,
      previous: 81.9,
      delta: 4.8,
    },
    social: {
      current: 79.2,
      previous: 77.0,
      delta: 2.2,
    },
    governance: {
      current: 81.3,
      previous: 76.5,
      delta: 4.8,
    },
  },
  activity: {
    open_policies: 18,
    pending_audits: 6,
    active_csr_initiatives: 12,
    emissions_this_month_tco2e: 124.6,
  },
  top_contributors: [
    {
      user_id: "u-101",
      full_name: "Alice Admin",
      total_points: 4820,
    },
    {
      user_id: "u-102",
      full_name: "Frank Employee",
      total_points: 4515,
    },
    {
      user_id: "u-103",
      full_name: "Charlie Environmental",
      total_points: 4380,
    },
    {
      user_id: "u-104",
      full_name: "Diana Social",
      total_points: 4165,
    },
    {
      user_id: "u-105",
      full_name: "Ethan Governance",
      total_points: 3990,
    },
  ],
  recent_notifications: [
    {
      id: "n-1",
      user_id: "u-101",
      message: "Quarterly ESG summary is ready for executive review.",
      source_table: "dashboard_summary",
      is_read: false,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      id: "n-2",
      user_id: "u-102",
      message: "2 sustainability initiatives crossed the 80% completion mark.",
      source_table: "csr_initiative",
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      id: "n-3",
      user_id: "u-103",
      message: "Pending audit items dropped below the monthly threshold.",
      source_table: "compliance_audit",
      is_read: true,
      created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      id: "n-4",
      user_id: "u-104",
      message: "Environmental score improved after facility energy optimization.",
      source_table: "carbon_emission",
      is_read: true,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
  ],
};