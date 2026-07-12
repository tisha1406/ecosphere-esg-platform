import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { NotificationRecord } from "../schema";
import { useMarkNotificationReadMutation } from "../hooks";
import { Bell, BellOff, Check } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

interface NotificationsListProps {
  notifications?: NotificationRecord[];
  isLoading?: boolean;
}

export function NotificationsList({ notifications = [], isLoading = false }: NotificationsListProps) {
  const markRead = useMarkNotificationReadMutation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="You're all caught up! New notifications will appear here."
            icon={<BellOff className="w-8 h-8 text-muted-foreground" />}
            className="py-8"
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-colors duration-150",
                  notif.is_read
                    ? "border-border bg-card opacity-60"
                    : "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                      {notif.source_table.replace(/_/g, " ")}
                    </Badge>
                    {!notif.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    )}
                  </div>
                </div>
                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => markRead.mutate(notif.id)}
                    disabled={markRead.isPending}
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
