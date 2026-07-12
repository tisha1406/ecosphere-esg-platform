import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { csrSchema, CsrFormValues } from "../schema";
import { useCreateCsrMutation } from "../hooks";
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
import { Select } from "../../../shared/components/ui/select";

interface CsrInitiativeFormProps {
  onSuccess: () => void;
}

export function CsrInitiativeForm({ onSuccess }: CsrInitiativeFormProps) {
  const mutation = useCreateCsrMutation();

  const form = useForm<CsrFormValues>({
    resolver: zodResolver(csrSchema),
    defaultValues: {
      name: "",
      budget: 0,
      beneficiaries: 0,
      status: "planned",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      responsible_id: "",
    },
  });

  const onSubmit = async (data: CsrFormValues) => {
    const payload: CsrFormValues = {
      ...data,
      end_date: data.end_date || undefined,
      responsible_id: data.responsible_id || undefined,
    };
    await mutation.mutateAsync(payload);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initiative Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Community Tree Planting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="beneficiaries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiaries</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onChange={field.onChange} value={field.value} name={field.name}>
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-social hover:bg-social/90"
        >
          {mutation.isPending ? "Creating…" : "Create Initiative"}
        </Button>
      </form>
    </Form>
  );
}
