import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wasteSchema, WasteFormValues } from "../schema";
import { useCreateWasteMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Select } from "../../../shared/components/ui/select";
import { v4 as uuidv4 } from "uuid";

export function WasteForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreateWasteMutation();

  const form = useForm<any>({
    resolver: zodResolver(wasteSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      waste_type: "recycled",
      kg_recycled: 0,
      kg_landfill: 0,
      company_id: "00000000-0000-0000-0000-000000000000",
    }
  });

  const onSubmit = (data: WasteFormValues) => {
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
        <FormField control={form.control} name="waste_type" render={({ field }) => (
          <FormItem><FormLabel>Waste Type</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="recycled">Recycled</option>
                <option value="landfill">Landfill</option>
                <option value="composted">Composted</option>
                <option value="hazardous">Hazardous</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="kg_recycled" render={({ field }) => (
          <FormItem><FormLabel>Recycled (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="kg_landfill" render={({ field }) => (
          <FormItem><FormLabel>Landfill (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-environmental hover:bg-environmental/90">
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
