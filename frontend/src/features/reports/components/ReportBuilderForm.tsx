import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportBuilderSchema, ReportBuilderFormValues } from "../schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Select } from "../../../shared/components/ui/select";
import { Button } from "../../../shared/components/ui/button";

interface ReportBuilderFormProps {
  onSubmit: (data: ReportBuilderFormValues) => void;
  isLoading: boolean;
}

export function ReportBuilderForm({ onSubmit, isLoading }: ReportBuilderFormProps) {
  const form = useForm<any>({
    resolver: zodResolver(reportBuilderSchema),
    defaultValues: {
      company_id: "default-company-id",
      period: "2026-FY",
      format: "pdf",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:flex md:space-y-0 md:space-x-4 items-end">
        <FormField control={form.control} name="company_id" render={({ field }) => (
          <FormItem className="flex-1"><FormLabel>Company</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="default-company-id">EcoSphere Client</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="period" render={({ field }) => (
          <FormItem className="flex-1"><FormLabel>Reporting Period</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="2026-FY">FY 2026</option>
                <option value="Q1-2026">Q1 2026</option>
                <option value="Q2-2026">Q2 2026</option>
                <option value="Q3-2026">Q3 2026</option>
                <option value="Q4-2026">Q4 2026</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="format" render={({ field }) => (
          <FormItem className="w-32"><FormLabel>Format</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (XLSX)</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
      </form>
    </Form>
  );
}
