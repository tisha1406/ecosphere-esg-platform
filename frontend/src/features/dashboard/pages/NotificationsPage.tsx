import React from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { useNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from "../hooks";
import { NotificationRecord } from "../schema";
import { cn } from "../../../shared/lib/utils";

function relTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diffMs / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationsPage() {
  const { data: notifData, isLoading } = useNotificationsQuery({ page: 1, page_size: 50 });
  const notifications: NotificationRecord[] = notifData?.data?.data?.items ?? [];
  const total = notifData?.data?.data?.total ?? 0;
  
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const hasUnread = notifications.some((n) => !n.is_read);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1">
            You have {total} total notifications in your history.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={!hasUnread || markAllRead.isPending}
          onClick={() => markAllRead.mutate()}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start justify-between p-4 transition-colors hover:bg-muted/30",
                    !notif.is_read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {!notif.is_read ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                      )}
                    </div>
                    <div>
                      <p className={cn("text-sm", !notif.is_read && "font-medium text-foreground")}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {relTime(notif.created_at)} • Source: {notif.source_table}
                      </p>
                    </div>
                  </div>
                  {!notif.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Mark as read"
                      onClick={() => markRead.mutate(notif.id)}
                      disabled={markRead.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
