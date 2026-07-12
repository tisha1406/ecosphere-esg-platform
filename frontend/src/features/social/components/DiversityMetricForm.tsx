import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diversitySchema, DiversityFormValues } from "../schema";
import { useCreateDiversityMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";

interface DiversityMetricFormProps {
  onSuccess: () => void;
}

export function DiversityMetricForm({ onSuccess }: DiversityMetricFormProps) {
  const mutation = useCreateDiversityMutation();

  const form = useForm<any>({
    resolver: zodResolver(diversitySchema),
    defaultValues: {
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      department_id: "00000000-0000-0000-0000-000000000000",
      gender_ratio: 0.5,
      inclusion_score: 50,
    },
  });

  const onSubmit = (data: DiversityFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period (YYYY-MM)</FormLabel>
                <FormControl>
                  <Input placeholder="2026-01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department ID</FormLabel>
                <FormControl>
                  <Input placeholder="UUID of the department" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="gender_ratio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender Ratio (0–1, female/total)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" max="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inclusion_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inclusion Score (0–100)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0" max="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-social hover:bg-social/90"
        >
          {mutation.isPending ? "Saving…" : "Save Metric"}
        </Button>
      </form>
    </Form>
  );
}
