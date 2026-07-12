import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { socialApi } from "../api";
import { WellbeingFormValues, CsrFormValues, DiversityFormValues } from "../schema";

// ── Wellbeing ──────────────────────────────────────────────
export const useWellbeingQuery = (params?: any) =>
  useQuery({
    queryKey: ["wellbeing", params],
    queryFn: () => socialApi.getWellbeing(params),
  });

export const useCreateWellbeingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WellbeingFormValues) => socialApi.createWellbeing(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellbeing"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Wellbeing survey recorded");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to create record"),
  });
};

export const useUpdateWellbeingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WellbeingFormValues> }) =>
      socialApi.updateWellbeing(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellbeing"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Wellbeing record updated");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to update record"),
  });
};

export const useDeleteWellbeingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialApi.deleteWellbeing(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellbeing"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Wellbeing record deleted");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to delete record"),
  });
};

// ── CSR Initiatives ────────────────────────────────────────
export const useCsrQuery = (params?: any) =>
  useQuery({
    queryKey: ["csr", params],
    queryFn: () => socialApi.getCsrInitiatives(params),
  });

export const useCreateCsrMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CsrFormValues) => socialApi.createCsrInitiative(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["csr"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("CSR initiative created");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to create initiative"),
  });
};

export const useUpdateCsrMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CsrFormValues> }) =>
      socialApi.updateCsrInitiative(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["csr"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("CSR initiative updated");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to update initiative"),
  });
};

export const useDeleteCsrMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialApi.deleteCsrInitiative(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["csr"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("CSR initiative deleted");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to delete initiative"),
  });
};

// ── Diversity Metrics ──────────────────────────────────────
export const useDiversityQuery = (params?: any) =>
  useQuery({
    queryKey: ["diversity", params],
    queryFn: () => socialApi.getDiversityMetrics(params),
  });

export const useCreateDiversityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DiversityFormValues) => socialApi.createDiversityMetric(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diversity"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Diversity metric recorded");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to create metric"),
  });
};

export const useUpdateDiversityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiversityFormValues> }) =>
      socialApi.updateDiversityMetric(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diversity"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Diversity metric updated");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to update metric"),
  });
};

export const useDeleteDiversityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialApi.deleteDiversityMetric(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diversity"] });
      qc.invalidateQueries({ queryKey: ["socialScore"] });
      toast.success("Diversity metric deleted");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to delete metric"),
  });
};

// ── Social Score ───────────────────────────────────────────
export const useSocialScoreQuery = (
  params: { company_id: string; start_date: string; end_date: string }
) =>
  useQuery({
    queryKey: ["socialScore", params],
    queryFn: () => socialApi.getSocialScore(params),
    enabled: !!params.company_id && !!params.start_date && !!params.end_date,
  });
