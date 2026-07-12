import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { environmentalApi } from "../api";
import { EmissionFormValues, EnergyFormValues, WasteFormValues } from "../schema";

export const useEmissionsQuery = (params?: any) => {
  return useQuery({
    queryKey: ["emissions", params],
    queryFn: () => environmentalApi.getEmissions(params),
    staleTime: 30_000,
  });
};

export const useCreateEmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmissionFormValues) => environmentalApi.createEmission(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<EmissionFormValues> }) => environmentalApi.updateEmission(id, data),
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
    mutationFn: (id: string) => environmentalApi.deleteEmission(id),
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
    queryFn: () => environmentalApi.getEnergy(params),
    staleTime: 30_000,
  });
};

export const useCreateEnergyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EnergyFormValues) => environmentalApi.createEnergy(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<EnergyFormValues> }) => environmentalApi.updateEnergy(id, data),
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
    mutationFn: (id: string) => environmentalApi.deleteEnergy(id),
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
    queryFn: () => environmentalApi.getWaste(params),
    staleTime: 30_000,
  });
};

export const useCreateWasteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WasteFormValues) => environmentalApi.createWaste(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<WasteFormValues> }) => environmentalApi.updateWaste(id, data),
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
    mutationFn: (id: string) => environmentalApi.deleteWaste(id),
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
    queryFn: () => environmentalApi.getEnvironmentalScore(params),
    staleTime: 30_000,
    enabled: !!params.company_id && !!params.start_date && !!params.end_date,
  });
};
