import { z } from "zod";

export const emissionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  source: z.string().min(1, "Source is required").max(255),
  scope: z.enum(["scope_1", "scope_2", "scope_3"]),
  value_tco2e: z.coerce.number().min(0, "Must be >= 0"),
  company_id: z.string().uuid(),
});
export type EmissionFormValues = z.infer<typeof emissionSchema>;

export const energySchema = z.object({
  date: z.string().min(1, "Date is required"),
  energy_type: z.enum(["electricity", "gas", "renewable", "other"]),
  kwh_consumed: z.coerce.number().min(0, "Must be >= 0"),
  facility_id: z.string().uuid(),
});
export type EnergyFormValues = z.infer<typeof energySchema>;

export const wasteSchema = z.object({
  date: z.string().min(1, "Date is required"),
  waste_type: z.enum(["recycled", "landfill", "composted", "hazardous"]),
  kg_recycled: z.coerce.number().min(0, "Must be >= 0"),
  kg_landfill: z.coerce.number().min(0, "Must be >= 0"),
  company_id: z.string().uuid(),
});
export type WasteFormValues = z.infer<typeof wasteSchema>;
