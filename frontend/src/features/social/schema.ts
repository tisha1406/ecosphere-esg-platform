import { z } from "zod";

// --- Wellbeing Survey ---
export const wellbeingSchema = z.object({
  employee_id: z.string().uuid("Must be a valid employee UUID"),
  survey_date: z.string().min(1, "Date is required"),
  satisfaction_score: z.coerce
    .number()
    .min(0, "Must be >= 0")
    .max(10, "Must be <= 10"),
});
export type WellbeingFormValues = z.infer<typeof wellbeingSchema>;

// --- CSR Initiative ---
export const csrSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  budget: z.coerce.number().min(0, "Must be >= 0"),
  beneficiaries: z.coerce.number().int().min(0, "Must be >= 0"),
  status: z.enum(["planned", "active", "completed"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  responsible_id: z.string().uuid("Must be a valid user UUID").optional(),
});
export type CsrFormValues = z.infer<typeof csrSchema>;

// --- Diversity Metric ---
export const diversitySchema = z.object({
  period: z.string().min(1, "Period is required").max(50),
  department_id: z.string().uuid("Must be a valid department UUID"),
  gender_ratio: z.coerce
    .number()
    .min(0, "Must be >= 0")
    .max(1, "Must be <= 1"),
  inclusion_score: z.coerce
    .number()
    .min(0, "Must be >= 0")
    .max(100, "Must be <= 100"),
});
export type DiversityFormValues = z.infer<typeof diversitySchema>;

// --- Read Types ---
export interface WellbeingRecord {
  id: string;
  employee_id: string;
  survey_date: string;
  satisfaction_score: number;
  is_active: boolean;
  created_at: string;
}

export interface CsrInitiative {
  id: string;
  name: string;
  budget: number;
  beneficiaries: number;
  status: "planned" | "active" | "completed";
  start_date: string;
  end_date?: string;
  responsible_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface DiversityMetric {
  id: string;
  period: string;
  department_id: string;
  gender_ratio: number;
  inclusion_score: number;
  is_active: boolean;
  created_at: string;
}

export interface SocialScore {
  wellbeing_score: number;
  csr_score: number;
  diversity_score: number;
  composite_score: number;
  period?: string;
}
