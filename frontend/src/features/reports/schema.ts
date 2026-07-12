import { z } from "zod";

export const reportBuilderSchema = z.object({
  company_id: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  format: z.enum(["pdf", "xlsx"]),
});

export type ReportBuilderFormValues = z.infer<typeof reportBuilderSchema>;
