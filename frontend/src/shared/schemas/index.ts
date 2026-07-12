import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export const paginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  page_size: z.number().int().positive().default(10),
  search: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});
