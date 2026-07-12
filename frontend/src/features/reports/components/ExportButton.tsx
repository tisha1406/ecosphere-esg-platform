import React from "react";
import { Button } from "../../../shared/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useExportReportMutation } from "../hooks";

interface ExportButtonProps {
  company_id: string;
  period: string;
  format: "pdf" | "xlsx";
}

export function ExportButton({ company_id, period, format }: ExportButtonProps) {
  const mutation = useExportReportMutation();

  const handleExport = () => {
    mutation.mutate({ company_id, period, format });
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={mutation.isPending || !company_id || !period}
      className="bg-primary hover:bg-primary/90"
    >
      {mutation.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Export {format.toUpperCase()}
    </Button>
  );
}
