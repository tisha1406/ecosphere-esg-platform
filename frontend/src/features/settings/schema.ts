import { z } from "zod";

export const esgConfigSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  carbon_target: z.number().min(0, "Must be positive"),
  water_target: z.number().min(0, "Must be positive"),
  waste_target: z.number().min(0, "Must be positive"),
  diversity_target: z.number().min(0).max(100, "Percentage must be between 0 and 100"),
  governance_target: z.number().min(0).max(100, "Percentage must be between 0 and 100"),
  low_score_threshold: z.number().min(0).max(100, "Must be between 0 and 100"),
  medium_score_threshold: z.number().min(0).max(100, "Must be between 0 and 100"),
});

export type EsgConfigFormValues = z.infer<typeof esgConfigSchema>;

export const notificationsSchema = z.object({
  notification_email_alerts: z.boolean().default(true),
  notification_weekly_reports: z.boolean().default(true),
});

export type NotificationsFormValues = z.infer<typeof notificationsSchema>;
