import { useQuery, useMutation } from "@tanstack/react-query";
import { reportsApi, ConsolidatedReport } from "../api";
import { toast } from "sonner";

export const useConsolidatedReportQuery = (params: { company_id: string; period: string }) => {
  return useQuery<ConsolidatedReport, Error>({
    queryKey: ["consolidatedReport", params],
    queryFn: () => reportsApi.getConsolidatedReport(params),
    staleTime: 30_000,
    enabled: !!params.company_id && !!params.period,
  });
};

export const useExportReportMutation = () => {
  return useMutation({
    mutationFn: (data: { format: "pdf" | "xlsx"; company_id: string; period: string }) => reportsApi.exportReport(data),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ESG_Report_${variables.period}.${variables.format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success(`Successfully exported report as ${variables.format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export report");
    },
  });
};
