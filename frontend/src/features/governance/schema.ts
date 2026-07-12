import { z } from "zod";

export const policySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.string().min(1, "Category is required").max(100),
  status: z.enum(["draft", "active", "archived"]),
  effective_date: z.string().min(1, "Effective Date is required"),
  owner_id: z.string().uuid(),
});
export type PolicyFormValues = z.infer<typeof policySchema>;

export const auditSchema = z.object({
  audit_date: z.string().min(1, "Date is required"),
  score: z.coerce.number().min(0, "Must be >= 0").max(100, "Max is 100"),
  findings: z.string().min(1, "Findings are required"),
  auditor_id: z.string().uuid(),
});
export type AuditFormValues = z.infer<typeof auditSchema>;

export const boardActivitySchema = z.object({
  meeting_date: z.string().min(1, "Date is required"),
  topic: z.string().min(1, "Topic is required").max(255),
  decision: z.string().min(1, "Decision is required"),
  attendee_ids: z.array(z.string().uuid()).default([]),
});
export type BoardActivityFormValues = z.infer<typeof boardActivitySchema>;
