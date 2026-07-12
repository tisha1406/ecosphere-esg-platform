import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { socialApi } from "../api";
import { WellbeingFormValues, CsrFormValues, DiversityFormValues } from "../schema";
import { demoSocial, makeListResponse } from "../../demo/demoData";

// ── Wellbeing ──────────────────────────────────────────────
export const useWellbeingQuery = (params?: any) =>
  useQuery({
    queryKey: ["wellbeing", params],
    queryFn: async () => makeListResponse(demoSocial.wellbeing, params),
    initialData: makeListResponse(demoSocial.wellbeing, params),
    staleTime: Infinity,
  });

export const useCreateWellbeingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: WellbeingFormValues) => ({ ok: true }),
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
    mutationFn: async (_payload: { id: string; data: Partial<WellbeingFormValues> }) => ({ ok: true }),
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
    mutationFn: async (_id: string) => ({ ok: true }),
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
    queryFn: async () => makeListResponse(demoSocial.csr, params),
    initialData: makeListResponse(demoSocial.csr, params),
    staleTime: Infinity,
  });

export const useCreateCsrMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: CsrFormValues) => ({ ok: true }),
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
    mutationFn: async (_payload: { id: string; data: Partial<CsrFormValues> }) => ({ ok: true }),
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
    mutationFn: async (_id: string) => ({ ok: true }),
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
    queryFn: async () => makeListResponse(demoSocial.diversity, params),
    initialData: makeListResponse(demoSocial.diversity, params),
    staleTime: Infinity,
  });

export const useCreateDiversityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: DiversityFormValues) => ({ ok: true }),
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
    mutationFn: async (_payload: { id: string; data: Partial<DiversityFormValues> }) => ({ ok: true }),
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
    mutationFn: async (_id: string) => ({ ok: true }),
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
    queryFn: async () => ({ data: demoSocial.score }),
    initialData: { data: demoSocial.score },
    staleTime: Infinity,
    enabled: !!params.company_id && !!params.start_date && !!params.end_date,
  });
