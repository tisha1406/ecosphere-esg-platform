import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emissionSchema, EmissionFormValues } from "../schema";
import { useCreateEmissionMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Select } from "../../../shared/components/ui/select";
import { v4 as uuidv4 } from "uuid";

export function EmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreateEmissionMutation();

  const form = useForm<any>({
    resolver: zodResolver(emissionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      source: "",
      scope: "scope_1",
      value_tco2e: 0,
      company_id: "00000000-0000-0000-0000-000000000000",
    }
  });

  const onSubmit = (data: EmissionFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="source" render={({ field }) => (
          <FormItem><FormLabel>Source</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="scope" render={({ field }) => (
          <FormItem><FormLabel>Scope</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="scope_1">Scope 1</option>
                <option value="scope_2">Scope 2</option>
                <option value="scope_3">Scope 3</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="value_tco2e" render={({ field }) => (
          <FormItem><FormLabel>Value (tCO2e)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-environmental hover:bg-environmental/90">
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
