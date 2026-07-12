import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auditSchema, AuditFormValues } from "../schema";
import { useCreateAuditMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { v4 as uuidv4 } from "uuid";

export function AuditForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreateAuditMutation();

  const form = useForm<any>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      audit_date: new Date().toISOString().split("T")[0],
      score: 0,
      findings: "",
      auditor_id: "00000000-0000-0000-0000-000000000000",
    }
  });

  const onSubmit = async (data: AuditFormValues) => {
    if (data.auditor_id === "00000000-0000-0000-0000-000000000000") {
      data.auditor_id = uuidv4(); 
    }
    await mutation.mutateAsync(data);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="audit_date" render={({ field }) => (
          <FormItem><FormLabel>Audit Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="score" render={({ field }) => (
          <FormItem><FormLabel>Score (0-100)</FormLabel><FormControl><Input type="number" step="1" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="findings" render={({ field }) => (
          <FormItem><FormLabel>Findings</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-governance hover:bg-governance/90" style={{ backgroundColor: "hsl(var(--governance))" }}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
