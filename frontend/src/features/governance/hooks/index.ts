import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { governanceApi } from "../api";
import { PolicyFormValues, AuditFormValues, BoardActivityFormValues } from "../schema";

export const usePoliciesQuery = (params?: any) => {
  return useQuery({
    queryKey: ["policies", params],
    queryFn: () => governanceApi.getPolicies(params),
  });
};

export const useCreatePolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PolicyFormValues) => governanceApi.createPolicy(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<PolicyFormValues> }) => governanceApi.updatePolicy(id, data),
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
    mutationFn: (id: string) => governanceApi.deletePolicy(id),
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
    queryFn: () => governanceApi.getAudits(params),
  });
};

export const useCreateAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuditFormValues) => governanceApi.createAudit(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<AuditFormValues> }) => governanceApi.updateAudit(id, data),
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
    mutationFn: (id: string) => governanceApi.deleteAudit(id),
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
    queryFn: () => governanceApi.getBoardActivities(params),
  });
};

export const useCreateBoardActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BoardActivityFormValues) => governanceApi.createBoardActivity(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<BoardActivityFormValues> }) => governanceApi.updateBoardActivity(id, data),
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
    mutationFn: (id: string) => governanceApi.deleteBoardActivity(id),
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
    queryFn: () => governanceApi.getGovernanceScore(params),
    enabled: !!params.start_date && !!params.end_date,
  });
};
