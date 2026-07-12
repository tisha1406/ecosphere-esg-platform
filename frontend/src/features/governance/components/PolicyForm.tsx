import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { policySchema, PolicyFormValues } from "../schema";
import { useCreatePolicyMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Select } from "../../../shared/components/ui/select";
import { v4 as uuidv4 } from "uuid";

export function PolicyForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreatePolicyMutation();

  const form = useForm<any>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: "",
      category: "",
      status: "draft",
      effective_date: new Date().toISOString().split("T")[0],
      owner_id: "00000000-0000-0000-0000-000000000000",
    }
  });

  const onSubmit = async (data: PolicyFormValues) => {
    if (data.owner_id === "00000000-0000-0000-0000-000000000000") {
      data.owner_id = uuidv4(); 
    }
    await mutation.mutateAsync(data);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Policy Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem><FormLabel>Status</FormLabel>
            <FormControl>
              <Select onChange={field.onChange} value={field.value} name={field.name}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>
            </FormControl>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="effective_date" render={({ field }) => (
          <FormItem><FormLabel>Effective Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-governance hover:bg-governance/90" style={{ backgroundColor: "hsl(var(--governance))" }}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
