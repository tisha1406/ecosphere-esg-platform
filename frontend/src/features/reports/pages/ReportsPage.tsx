import React, { useState } from "react";
import { ReportBuilderForm } from "../components/ReportBuilderForm";
import { ConsolidatedReportView } from "../components/ConsolidatedReportView";
import { ExportButton } from "../components/ExportButton";
import { useConsolidatedReportQuery } from "../hooks";
import { ReportBuilderFormValues } from "../schema";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function ReportsPage() {
  const [params, setParams] = useState<{ company_id: string; period: string }>({ company_id: "default", period: "Q2 2026" });
  const [format, setFormat] = useState<"pdf" | "xlsx">("pdf");

  const { data, isLoading, isError, error } = useConsolidatedReportQuery(params);

  const handleSubmit = (values: ReportBuilderFormValues) => {
    setParams({ company_id: values.company_id, period: values.period });
    setFormat(values.format);
  };

  const report = data;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Generate and export consolidated ESG reports.</p>
        </div>
        
        {report && params && (
          <div className="flex items-center">
            <ExportButton company_id={params.company_id} period={params.period} format={format} />
          </div>
        )}
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <ReportBuilderForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold">Failed to generate report</h3>
          <p className="text-sm opacity-80 mt-1">{error?.message || "An unexpected error occurred"}</p>
        </div>
      )}

      {report && !isLoading && !isError && (
        <ConsolidatedReportView report={report} />
      )}
      
      {!report && !isLoading && !isError && null}
    </div>
  );
}
