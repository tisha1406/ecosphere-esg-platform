import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationsSchema, NotificationsFormValues } from "../schema";
import { useCompanySettings, useUpdateCompanySettings } from "../hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "../../../shared/components/ui/form";
import { Switch } from "../../../shared/components/ui/switch";
import { Button } from "../../../shared/components/ui/button";
import { Loader2, Save } from "lucide-react";

export function NotificationsTab() {
  const { data: settings, isLoading } = useCompanySettings();
  const { mutate: updateSettings, isPending } = useUpdateCompanySettings();

  const form = useForm<any>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      notification_email_alerts: true,
      notification_weekly_reports: true,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        notification_email_alerts: settings.notification_email_alerts,
        notification_weekly_reports: settings.notification_weekly_reports,
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

  function onSubmit(values: NotificationsFormValues) {
    updateSettings(values);
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how the platform communicates important updates and summaries to your team.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notification_email_alerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm bg-card/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Critical Email Alerts</FormLabel>
                    <FormDescription>
                      Receive immediate email alerts for critical compliance issues or significant threshold breaches.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_weekly_reports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm bg-card/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Weekly Summaries</FormLabel>
                    <FormDescription>
                      Bundle module activity into a weekly digest delivered to your inbox.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Preferences
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
