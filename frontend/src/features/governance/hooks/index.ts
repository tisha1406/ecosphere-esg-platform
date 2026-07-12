import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { governanceApi } from "../api";
import { PolicyFormValues, AuditFormValues, BoardActivityFormValues } from "../schema";
import { demoGovernance, makeListResponse } from "../../demo/demoData";

export const usePoliciesQuery = (params?: any) => {
  return useQuery({
    queryKey: ["policies", params],
    queryFn: async () => makeListResponse(demoGovernance.policies, params),
    initialData: makeListResponse(demoGovernance.policies, params),
    staleTime: Infinity,
  });
};

export const useCreatePolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: PolicyFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Policy created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create policy");
    },
  });
};

export const useUpdatePolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<PolicyFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Policy updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update policy");
    },
  });
};

export const useDeletePolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Policy deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete policy");
    },
  });
};

export const useAuditsQuery = (params?: any) => {
  return useQuery({
    queryKey: ["audits", params],
    queryFn: async () => makeListResponse(demoGovernance.audits, params),
    initialData: makeListResponse(demoGovernance.audits, params),
    staleTime: Infinity,
  });
};

export const useCreateAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: AuditFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Audit created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create audit");
    },
  });
};

export const useUpdateAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<AuditFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Audit updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update audit");
    },
  });
};

export const useDeleteAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Audit deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete audit");
    },
  });
};

export const useBoardActivityQuery = (params?: any) => {
  return useQuery({
    queryKey: ["boardActivity", params],
    queryFn: async () => makeListResponse(demoGovernance.boardActivity, params),
    initialData: makeListResponse(demoGovernance.boardActivity, params),
    staleTime: Infinity,
  });
};

export const useCreateBoardActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: BoardActivityFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardActivity"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Board activity created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create board activity");
    },
  });
};

export const useUpdateBoardActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<BoardActivityFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardActivity"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Board activity updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update board activity");
    },
  });
};

export const useDeleteBoardActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardActivity"] });
      queryClient.invalidateQueries({ queryKey: ["governanceScore"] });
      toast.success("Board activity deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete board activity");
    },
  });
};

export const useGovernanceScoreQuery = (params: { start_date: string, end_date: string }) => {
  return useQuery({
    queryKey: ["governanceScore", params],
    queryFn: async () => ({ data: demoGovernance.score }),
    initialData: { data: demoGovernance.score },
    staleTime: Infinity,
    enabled: !!params.start_date && !!params.end_date,
  });
};
