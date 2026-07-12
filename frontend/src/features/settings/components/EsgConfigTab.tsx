import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esgConfigSchema, EsgConfigFormValues } from "../schema";
import { useCompanySettings, useUpdateCompanySettings } from "../hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Loader2, Save } from "lucide-react";

export function EsgConfigTab() {
  const { data: settings, isLoading } = useCompanySettings();
  const { mutate: updateSettings, isPending } = useUpdateCompanySettings();

  const form = useForm<EsgConfigFormValues>({
    resolver: zodResolver(esgConfigSchema),
    defaultValues: {
      company_name: "",
      carbon_target: 0,
      water_target: 0,
      waste_target: 0,
      diversity_target: 0,
      governance_target: 0,
      low_score_threshold: 0,
      medium_score_threshold: 0,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        company_name: settings.company_name,
        carbon_target: settings.carbon_target,
        water_target: settings.water_target,
        waste_target: settings.waste_target,
        diversity_target: settings.diversity_target,
        governance_target: settings.governance_target,
        low_score_threshold: settings.low_score_threshold,
        medium_score_threshold: settings.medium_score_threshold,
      });
    }
  }, [settings, form]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function onSubmit(values: EsgConfigFormValues) {
    updateSettings(values);
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium">ESG & Scoring Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Update the global targets and scoring thresholds for the platform.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">General Information</h4>
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 md:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mt-4">Pillar Targets</h4>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="carbon_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbon Target (tCO2e)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="water_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Target (m³)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waste_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waste Target (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diversity_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diversity Target (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="governance_target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governance Target (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 md:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mt-4">Scoring Thresholds</h4>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="low_score_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Score Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormDescription>Scores below this are considered At Risk (Red).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medium_score_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium Score Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormDescription>Scores above this are considered Excellent (Green).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
