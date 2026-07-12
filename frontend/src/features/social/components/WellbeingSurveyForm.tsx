import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wellbeingSchema, WellbeingFormValues } from "../schema";
import { useCreateWellbeingMutation } from "../hooks";
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

interface WellbeingSurveyFormProps {
  onSuccess: () => void;
}

export function WellbeingSurveyForm({ onSuccess }: WellbeingSurveyFormProps) {
  const mutation = useCreateWellbeingMutation();

  const form = useForm<any>({
    resolver: zodResolver(wellbeingSchema),
    defaultValues: {
      employee_id: "00000000-0000-0000-0000-000000000000",
      survey_date: new Date().toISOString().split("T")[0],
      satisfaction_score: 5,
      comments: "",
    },
  });

  const onSubmit = (data: WellbeingFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="employee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input placeholder="UUID of the employee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="survey_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Survey Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="satisfaction_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satisfaction Score (0–10)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0" max="10" {...field} />
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
          {mutation.isPending ? "Submitting…" : "Submit Survey"}
        </Button>
      </form>
    </Form>
  );
}
