import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportBuilderSchema, ReportBuilderFormValues } from "../schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../shared/components/ui/form";
import { Select } from "../../../shared/components/ui/select";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/components/ui/tooltip";
import { useExportReportMutation } from "../hooks";
import { Loader2, Settings2, Download } from "lucide-react";
import { toast } from "sonner";

export function CustomReportBuilder() {
  const exportMutation = useExportReportMutation();
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "xlsx" | null>(null);

  const form = useForm<ReportBuilderFormValues>({
    resolver: zodResolver(reportBuilderSchema),
    defaultValues: {
      company_id: "default-company-id", // currently backend handles this via auth or single-tenant default
      period: "2026-FY",
      format: "pdf",
    }
  });

  const onSubmit = (data: ReportBuilderFormValues) => {
    setDownloadFormat(data.format);
    exportMutation.mutate(
      { format: data.format, company_id: data.company_id, period: data.period },
      {
        onSuccess: () => {
          toast.success(`Report generated successfully as ${data.format.toUpperCase()}`);
        },
        onError: () => {
          toast.error("Failed to generate report.");
        },
        onSettled: () => {
          setDownloadFormat(null);
        }
      }
    );
  };

  const isPending = exportMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
        <Settings2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-primary">Custom Report Engine</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Generate specific exports of ESG data. Note: Granular filtering dimensions (Department, Employee, Category) are visible but currently disabled pending backend API support.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Supported Field: Period */}
            <FormField control={form.control} name="period" render={({ field }) => (
              <FormItem>
                <FormLabel>Reporting Period</FormLabel>
                <FormControl>
                  <Select onChange={field.onChange} value={field.value} name={field.name} className="glass-card">
                    <option value="2026-FY">FY 2026</option>
                    <option value="Q1-2026">Q1 2026</option>
                    <option value="Q2-2026">Q2 2026</option>
                    <option value="Q3-2026">Q3 2026</option>
                    <option value="Q4-2026">Q4 2026</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Supported Field: Format */}
            <FormField control={form.control} name="format" render={({ field }) => (
              <FormItem>
                <FormLabel>Export Format</FormLabel>
                <FormControl>
                  <Select onChange={field.onChange} value={field.value} name={field.name} className="glass-card">
                    <option value="pdf">PDF Document</option>
                    <option value="xlsx">Excel Spreadsheet</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <TooltipProvider>
              {/* Unsupported Field: Department */}
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="space-y-2 opacity-60">
                    <FormLabel>Department</FormLabel>
                    <Select disabled className="glass-card bg-muted/30">
                      <option>All Departments</option>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-primary/20">
                  <p className="text-sm">Department filtering requires backend API support (coming soon).</p>
                </TooltipContent>
              </Tooltip>

              {/* Unsupported Field: Employee */}
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="space-y-2 opacity-60">
                    <FormLabel>Employee Scope</FormLabel>
                    <Input disabled placeholder="Search employees..." className="glass-card bg-muted/30" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-primary/20">
                  <p className="text-sm">Employee-level scoping requires backend API support (coming soon).</p>
                </TooltipContent>
              </Tooltip>

              {/* Unsupported Field: Category */}
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="space-y-2 opacity-60">
                    <FormLabel>Data Category</FormLabel>
                    <Select disabled className="glass-card bg-muted/30">
                      <option>All Categories</option>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-primary/20">
                  <p className="text-sm">Category filtering requires backend API support (coming soon).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto glass-card shadow-sm px-8">
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isPending ? `Generating ${downloadFormat?.toUpperCase()}...` : "Generate Custom Report"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
