import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { environmentalApi } from "../api";
import { EmissionFormValues, EnergyFormValues, WasteFormValues } from "../schema";
import { demoEnvironmental, makeListResponse } from "../../demo/demoData";

export const useEmissionsQuery = (params?: any) => {
  return useQuery({
    queryKey: ["emissions", params],
    queryFn: async () => makeListResponse(demoEnvironmental.emissions, params),
    initialData: makeListResponse(demoEnvironmental.emissions, params),
    staleTime: Infinity,
  });
};

export const useCreateEmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: EmissionFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Emission record created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create emission record");
    },
  });
};

export const useUpdateEmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<EmissionFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Emission record updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update emission record");
    },
  });
};

export const useDeleteEmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emissions"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Emission record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete emission record");
    },
  });
};

export const useEnergyQuery = (params?: any) => {
  return useQuery({
    queryKey: ["energy", params],
    queryFn: async () => makeListResponse(demoEnvironmental.energy, params),
    initialData: makeListResponse(demoEnvironmental.energy, params),
    staleTime: Infinity,
  });
};

export const useCreateEnergyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: EnergyFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Energy record created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create energy record");
    },
  });
};

export const useUpdateEnergyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<EnergyFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Energy record updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update energy record");
    },
  });
};

export const useDeleteEnergyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Energy record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete energy record");
    },
  });
};

export const useWasteQuery = (params?: any) => {
  return useQuery({
    queryKey: ["waste", params],
    queryFn: async () => makeListResponse(demoEnvironmental.waste, params),
    initialData: makeListResponse(demoEnvironmental.waste, params),
    staleTime: Infinity,
  });
};

export const useCreateWasteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: WasteFormValues) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Waste record created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create waste record");
    },
  });
};

export const useUpdateWasteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; data: Partial<WasteFormValues> }) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Waste record updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update waste record");
    },
  });
};

export const useDeleteWasteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => ({ ok: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste"] });
      queryClient.invalidateQueries({ queryKey: ["environmentalScore"] });
      toast.success("Waste record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete waste record");
    },
  });
};

export const useEnvironmentalScoreQuery = (params: { company_id: string, start_date: string, end_date: string }) => {
  return useQuery({
    queryKey: ["environmentalScore", params],
    queryFn: async () => ({ data: demoEnvironmental.score }),
    initialData: { data: demoEnvironmental.score },
    staleTime: Infinity,
    enabled: !!params.company_id && !!params.start_date && !!params.end_date,
  });
};
