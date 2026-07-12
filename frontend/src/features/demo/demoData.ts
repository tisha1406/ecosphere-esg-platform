import { mockDashboardSummary } from "../dashboard/mock";
import type { ConsolidatedReport } from "../reports/api";
import type { EmissionFormValues, EnergyFormValues, WasteFormValues } from "../environmental/schema";
import type { WellbeingRecord, CsrInitiative, DiversityMetric } from "../social/schema";
import type { BadgeRecord, LeaderboardEntry, PointsHistoryEntry } from "../gamification/schema";

const now = new Date();
const isoDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

const companyId = "11111111-1111-1111-1111-111111111111";
const facilityId = "22222222-2222-2222-2222-222222222222";
const employeeIds = [
  "33333333-3333-3333-3333-333333333331",
  "33333333-3333-3333-3333-333333333332",
  "33333333-3333-3333-3333-333333333333",
  "33333333-3333-3333-3333-333333333334",
  "33333333-3333-3333-3333-333333333335",
  "33333333-3333-3333-3333-333333333336",
];

export const demoEnvironmental = {
  score: 84,
  emissions: [
    { id: "e-1", date: "2026-07-01", source: "Main office electricity", scope: "scope_2", value_tco2e: 12.4, company_id: companyId, is_active: true, created_at: isoDaysAgo(11), updated_at: isoDaysAgo(11) },
    { id: "e-2", date: "2026-07-03", source: "Fleet fuel", scope: "scope_1", value_tco2e: 8.6, company_id: companyId, is_active: true, created_at: isoDaysAgo(9), updated_at: isoDaysAgo(9) },
    { id: "e-3", date: "2026-07-05", source: "Supplier logistics", scope: "scope_3", value_tco2e: 21.2, company_id: companyId, is_active: true, created_at: isoDaysAgo(7), updated_at: isoDaysAgo(7) },
    { id: "e-4", date: "2026-07-08", source: "Data center backup power", scope: "scope_2", value_tco2e: 5.8, company_id: companyId, is_active: true, created_at: isoDaysAgo(4), updated_at: isoDaysAgo(4) },
    { id: "e-5", date: "2026-07-11", source: "Business travel", scope: "scope_3", value_tco2e: 14.7, company_id: companyId, is_active: true, created_at: isoDaysAgo(1), updated_at: isoDaysAgo(1) },
    { id: "e-6", date: "2026-06-28", source: "Warehouse heating", scope: "scope_1", value_tco2e: 18.9, company_id: companyId, is_active: true, created_at: isoDaysAgo(14), updated_at: isoDaysAgo(14) },
    { id: "e-7", date: "2026-06-24", source: "Employee commuting", scope: "scope_3", value_tco2e: 9.3, company_id: companyId, is_active: true, created_at: isoDaysAgo(18), updated_at: isoDaysAgo(18) },
    { id: "e-8", date: "2026-06-19", source: "Manufacturing electricity", scope: "scope_2", value_tco2e: 27.5, company_id: companyId, is_active: true, created_at: isoDaysAgo(23), updated_at: isoDaysAgo(23) },
  ] as Array<EmissionFormValues & { id: string; company_id: string; is_active: boolean; created_at: string; updated_at: string }>,
  energy: [
    { id: "en-1", date: "2026-07-01", energy_type: "electricity", kwh_consumed: 18240, facility_id: facilityId, is_active: true, created_at: isoDaysAgo(11), updated_at: isoDaysAgo(11) },
    { id: "en-2", date: "2026-07-04", energy_type: "gas", kwh_consumed: 7400, facility_id: facilityId, is_active: true, created_at: isoDaysAgo(8), updated_at: isoDaysAgo(8) },
    { id: "en-3", date: "2026-07-07", energy_type: "renewable", kwh_consumed: 12900, facility_id: facilityId, is_active: true, created_at: isoDaysAgo(5), updated_at: isoDaysAgo(5) },
    { id: "en-4", date: "2026-07-10", energy_type: "electricity", kwh_consumed: 19450, facility_id: facilityId, is_active: true, created_at: isoDaysAgo(2), updated_at: isoDaysAgo(2) },
    { id: "en-5", date: "2026-06-29", energy_type: "other", kwh_consumed: 3200, facility_id: facilityId, is_active: true, created_at: isoDaysAgo(13), updated_at: isoDaysAgo(13) },
  ] as Array<EnergyFormValues & { id: string; facility_id: string; is_active: boolean; created_at: string; updated_at: string }>,
  waste: [
    { id: "w-1", date: "2026-07-01", waste_type: "recycled", kg_recycled: 820, kg_landfill: 110, company_id: companyId, is_active: true, created_at: isoDaysAgo(11), updated_at: isoDaysAgo(11) },
    { id: "w-2", date: "2026-07-04", waste_type: "landfill", kg_recycled: 120, kg_landfill: 910, company_id: companyId, is_active: true, created_at: isoDaysAgo(8), updated_at: isoDaysAgo(8) },
    { id: "w-3", date: "2026-07-07", waste_type: "composted", kg_recycled: 340, kg_landfill: 75, company_id: companyId, is_active: true, created_at: isoDaysAgo(5), updated_at: isoDaysAgo(5) },
    { id: "w-4", date: "2026-07-10", waste_type: "hazardous", kg_recycled: 18, kg_landfill: 44, company_id: companyId, is_active: true, created_at: isoDaysAgo(2), updated_at: isoDaysAgo(2) },
  ] as Array<WasteFormValues & { id: string; company_id: string; is_active: boolean; created_at: string; updated_at: string }>,
};

export const demoSocial = {
  score: {
    wellbeing_score: 80.5,
    csr_score: 77.2,
    diversity_score: 79.4,
    composite_score: 79.0,
    period: "Q2 2026",
  },
  wellbeing: [
    { id: "wb-1", employee_id: employeeIds[0], survey_date: "2026-06-03", satisfaction_score: 7, is_active: true, created_at: isoDaysAgo(39) },
    { id: "wb-2", employee_id: employeeIds[1], survey_date: "2026-06-11", satisfaction_score: 8, is_active: true, created_at: isoDaysAgo(31) },
    { id: "wb-3", employee_id: employeeIds[2], survey_date: "2026-06-18", satisfaction_score: 6, is_active: true, created_at: isoDaysAgo(24) },
    { id: "wb-4", employee_id: employeeIds[3], survey_date: "2026-07-02", satisfaction_score: 9, is_active: true, created_at: isoDaysAgo(10) },
    { id: "wb-5", employee_id: employeeIds[4], survey_date: "2026-07-09", satisfaction_score: 8, is_active: true, created_at: isoDaysAgo(3) },
    { id: "wb-6", employee_id: employeeIds[5], survey_date: "2026-07-11", satisfaction_score: 7, is_active: true, created_at: isoDaysAgo(1) },
  ] as WellbeingRecord[],
  csr: [
    { id: "csr-1", name: "STEM Mentorship Program", budget: 45000, beneficiaries: 120, status: "active", start_date: "2026-05-01", end_date: "2026-10-01", responsible_id: employeeIds[0], is_active: true, created_at: isoDaysAgo(72) },
    { id: "csr-2", name: "Community Solar Outreach", budget: 75000, beneficiaries: 320, status: "active", start_date: "2026-04-15", end_date: "2026-11-15", responsible_id: employeeIds[1], is_active: true, created_at: isoDaysAgo(88) },
    { id: "csr-3", name: "Food Bank Volunteer Drive", budget: 15000, beneficiaries: 540, status: "completed", start_date: "2026-02-01", end_date: "2026-06-01", responsible_id: employeeIds[2], is_active: true, created_at: isoDaysAgo(132) },
    { id: "csr-4", name: "Local Schools Sustainability Kits", budget: 28000, beneficiaries: 180, status: "planned", start_date: "2026-08-01", end_date: "2026-12-15", responsible_id: employeeIds[3], is_active: true, created_at: isoDaysAgo(20) },
    { id: "csr-5", name: "Accessibility Upgrade Grants", budget: 61000, beneficiaries: 75, status: "active", start_date: "2026-06-10", end_date: "2026-12-30", responsible_id: employeeIds[4], is_active: true, created_at: isoDaysAgo(34) },
  ] as CsrInitiative[],
  diversity: [
    { id: "div-1", period: "2026 Q1", department_id: "44444444-4444-4444-4444-444444444441", gender_ratio: 0.48, inclusion_score: 74, is_active: true, created_at: isoDaysAgo(95) },
    { id: "div-2", period: "2026 Q2", department_id: "44444444-4444-4444-4444-444444444442", gender_ratio: 0.53, inclusion_score: 81, is_active: true, created_at: isoDaysAgo(20) },
    { id: "div-3", period: "2026 Q2", department_id: "44444444-4444-4444-4444-444444444443", gender_ratio: 0.57, inclusion_score: 77, is_active: true, created_at: isoDaysAgo(19) },
    { id: "div-4", period: "2026 Q2", department_id: "44444444-4444-4444-4444-444444444444", gender_ratio: 0.44, inclusion_score: 69, is_active: true, created_at: isoDaysAgo(18) },
    { id: "div-5", period: "2026 Q2", department_id: "44444444-4444-4444-4444-444444444445", gender_ratio: 0.61, inclusion_score: 84, is_active: true, created_at: isoDaysAgo(17) },
  ] as DiversityMetric[],
};

export const demoGovernance = {
  score: 81,
  policies: [
    { id: "p-1", name: "Information Security Policy", category: "Risk & Compliance", status: "active", effective_date: "2026-01-10", owner_id: employeeIds[0], is_active: true, created_at: isoDaysAgo(170), updated_at: isoDaysAgo(10) },
    { id: "p-2", name: "Supplier Code of Conduct", category: "Procurement", status: "active", effective_date: "2026-02-14", owner_id: employeeIds[1], is_active: true, created_at: isoDaysAgo(140), updated_at: isoDaysAgo(12) },
    { id: "p-3", name: "Anti-Bribery Policy", category: "Ethics", status: "active", effective_date: "2026-03-01", owner_id: employeeIds[2], is_active: true, created_at: isoDaysAgo(132), updated_at: isoDaysAgo(20) },
    { id: "p-4", name: "Whistleblower Procedure", category: "Governance", status: "draft", effective_date: "2026-07-01", owner_id: employeeIds[3], is_active: true, created_at: isoDaysAgo(9), updated_at: isoDaysAgo(9) },
    { id: "p-5", name: "Data Retention Standard", category: "Data Management", status: "archived", effective_date: "2025-09-01", owner_id: employeeIds[4], is_active: true, created_at: isoDaysAgo(320), updated_at: isoDaysAgo(200) },
  ],
  audits: [
    { id: "a-1", audit_date: "2026-06-02", score: 92, findings: "No critical issues. Minor documentation updates needed.", auditor_id: employeeIds[0], is_active: true, created_at: isoDaysAgo(40), updated_at: isoDaysAgo(40) },
    { id: "a-2", audit_date: "2026-06-18", score: 86, findings: "Two procurement files missing approval timestamps.", auditor_id: employeeIds[1], is_active: true, created_at: isoDaysAgo(24), updated_at: isoDaysAgo(24) },
    { id: "a-3", audit_date: "2026-07-02", score: 88, findings: "Follow-up review scheduled for vendor due diligence.", auditor_id: employeeIds[2], is_active: true, created_at: isoDaysAgo(10), updated_at: isoDaysAgo(10) },
    { id: "a-4", audit_date: "2026-07-09", score: 95, findings: "Control testing passed for the quarter-end review.", auditor_id: employeeIds[3], is_active: true, created_at: isoDaysAgo(3), updated_at: isoDaysAgo(3) },
  ],
  boardActivity: [
    { id: "b-1", meeting_date: "2026-05-20", topic: "Q2 ESG target review", decision: "Approved increased renewable energy target to 45%.", attendee_ids: [employeeIds[0], employeeIds[1]], is_active: true, created_at: isoDaysAgo(53), updated_at: isoDaysAgo(53) },
    { id: "b-2", meeting_date: "2026-06-17", topic: "Vendor risk review", decision: "Added mandatory sustainability clause for new contracts.", attendee_ids: [employeeIds[1], employeeIds[2], employeeIds[3]], is_active: true, created_at: isoDaysAgo(25), updated_at: isoDaysAgo(25) },
    { id: "b-3", meeting_date: "2026-07-03", topic: "Audit remediation plan", decision: "Assigned remediation owners and due dates.", attendee_ids: [employeeIds[0], employeeIds[4]], is_active: true, created_at: isoDaysAgo(9), updated_at: isoDaysAgo(9) },
  ],
};

export const demoGamification = {
  badges: [
    { id: "bd-1", name: "Eco Warrior", criteria: "Reach 500 points from environmental actions", icon: "star.png", points_value: 500, is_active: true, created_at: isoDaysAgo(120) },
    { id: "bd-2", name: "Carbon Crusher", criteria: "Reduce emissions by 10% in a quarter", icon: "zap.png", points_value: 1000, is_active: true, created_at: isoDaysAgo(100) },
    { id: "bd-3", name: "People Champion", criteria: "Complete 5 wellbeing surveys", icon: "star.png", points_value: 1500, is_active: true, created_at: isoDaysAgo(80) },
    { id: "bd-4", name: "Governance Guardian", criteria: "Close 10 audit findings", icon: "zap.png", points_value: 2200, is_active: true, created_at: isoDaysAgo(70) },
    { id: "bd-5", name: "CSR Catalyst", criteria: "Launch 3 community initiatives", icon: "star.png", points_value: 3000, is_active: true, created_at: isoDaysAgo(50) },
    { id: "bd-6", name: "ESG Legend", criteria: "Cross 5000 total points", icon: "zap.png", points_value: 5000, is_active: true, created_at: isoDaysAgo(20) },
  ] as BadgeRecord[],
  leaderboard: {
    period: "all-time",
    limit: 20,
    entries: [
      { user_id: employeeIds[0], full_name: "Alice Admin", total_points: 6420 },
      { user_id: employeeIds[1], full_name: "Frank Employee", total_points: 6015 },
      { user_id: employeeIds[2], full_name: "Charlie Environmental", total_points: 5880 },
      { user_id: employeeIds[3], full_name: "Diana Social", total_points: 5510 },
      { user_id: employeeIds[4], full_name: "Ethan Governance", total_points: 5340 },
      { user_id: employeeIds[5], full_name: "Bob Manager", total_points: 4980 },
    ] as LeaderboardEntry[],
  },
  userPoints: {
    total_points: 6015,
    history: [
      { id: "ph-1", points: 250, reason: "Completed energy audit follow-up", source_table: "environmental_action", source_id: "e-2", created_at: isoDaysAgo(1) },
      { id: "ph-2", points: 180, reason: "Submitted wellbeing survey batch", source_table: "employee_wellbeing", source_id: "wb-6", created_at: isoDaysAgo(3) },
      { id: "ph-3", points: 300, reason: "Closed compliance findings", source_table: "compliance_audits", source_id: "a-4", created_at: isoDaysAgo(5) },
      { id: "ph-4", points: 120, reason: "Added CSR volunteer hours", source_table: "csr_initiatives", source_id: "csr-2", created_at: isoDaysAgo(7) },
      { id: "ph-5", points: 400, reason: "Launched sustainability report", source_table: "manual_adjustment", source_id: "r-1", created_at: isoDaysAgo(10) },
    ] as PointsHistoryEntry[],
  },
};

export const demoReports: ConsolidatedReport = {
  company_name: "EcoSphere Holdings",
  period: "Q2 2026",
  environmental_score: 84,
  social_score: 79,
  governance_score: 81,
  overall_esg_score: 82,
  trend_series: [
    { month: "Jan", score: 74 },
    { month: "Feb", score: 76 },
    { month: "Mar", score: 77 },
    { month: "Apr", score: 79 },
    { month: "May", score: 81 },
    { month: "Jun", score: 82 },
  ],
  top_initiatives: [
    { name: "Renewable transition", impact: "Raised clean energy usage by 12%" },
    { name: "Supplier code rollout", impact: "Covered 92% of active vendors" },
    { name: "Volunteer hours program", impact: "Added 1,200 employee volunteer hours" },
  ],
  top_contributors: [
    { name: "Alice Admin", points: 4820 },
    { name: "Frank Employee", points: 4515 },
    { name: "Charlie Environmental", points: 4380 },
    { name: "Diana Social", points: 4165 },
  ],
};

export const makeListResponse = <T,>(items: T[], params?: { page?: number; page_size?: number; is_read?: boolean }) => {
  const filtered = typeof params?.is_read === "boolean"
    ? (items as Array<any>).filter((item) => item.is_read === params.is_read)
    : items;
  const page = params?.page ?? 1;
  const pageSize = params?.page_size ?? filtered.length;
  const start = (page - 1) * pageSize;
  return {
    data: {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      page_size: pageSize,
    },
  };
};

export const makeDoubleEnvelope = <T,>(items: T[], params?: { page?: number; page_size?: number; is_read?: boolean }) => ({
  data: makeListResponse(items, params),
});

export const demoUnreadCount = () =>
  mockDashboardSummary.recent_notifications.filter((item) => !item.is_read).length;
