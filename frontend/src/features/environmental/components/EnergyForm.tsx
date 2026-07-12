import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { energySchema, EnergyFormValues } from "../schema";
import { useCreateEnergyMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Select } from "../../../shared/components/ui/select";
import { v4 as uuidv4 } from "uuid";

export function EnergyForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreateEnergyMutation();

  const form = useForm<any>({
    resolver: zodResolver(energySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      energy_type: "electricity",
      kwh_consumed: 0,
      facility_id: "00000000-0000-0000-0000-000000000000",
    }
  });

  const onSubmit = async (data: EnergyFormValues) => {
    if (data.facility_id === "00000000-0000-0000-0000-000000000000") {
      data.facility_id = uuidv4(); 
    }
    await mutation.mutateAsync(data);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="energy_type" render={({ field }) => (
          <FormItem><FormLabel>Energy Type</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="electricity">Electricity</option>
                <option value="gas">Gas</option>
                <option value="renewable">Renewable</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="kwh_consumed" render={({ field }) => (
          <FormItem><FormLabel>Consumed (kWh)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-environmental hover:bg-environmental/90">
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
