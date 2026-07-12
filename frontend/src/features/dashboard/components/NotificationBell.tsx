import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { useUnreadCountQuery, useNotificationsQuery, useMarkNotificationReadMutation } from "../hooks";
import { NotificationRecord } from "../schema";
import { cn } from "../../../shared/lib/utils";
import { Check, BellOff } from "lucide-react";

function relTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diffMs / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const { data: unreadData } = useUnreadCountQuery();
  const unreadCount = (unreadData as unknown as number) ?? 0;

  const { data: notifData } = useNotificationsQuery({ page: 1, page_size: 8 });
  const notifications: NotificationRecord[] = notifData?.data?.data?.items ?? [];

  const markRead = useMarkNotificationReadMutation();
  const lastSeenNotifId = useRef<string | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      if (lastSeenNotifId.current) {
        for (const notif of notifications) {
          if (notif.id === lastSeenNotifId.current) break;
          if (!notif.is_read) {
            toast("New Notification", { description: notif.message });
          }
        }
      }
      lastSeenNotifId.current = notifications[0].id;
    }
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          id="notification-bell-btn"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center",
                "rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground",
                "animate-in zoom-in duration-200"
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <BellOff className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-2 px-3 py-2 text-sm border-b border-border last:border-0 transition-colors",
                !notif.is_read && "bg-primary/5"
              )}
            >
              {!notif.is_read && (
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              {notif.is_read && <span className="mt-1.5 shrink-0 w-1.5 h-1.5" />}
              <div className="flex-1 min-w-0">
                <p className={cn("leading-snug", !notif.is_read && "font-medium")}>
                  {notif.message}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{relTime(notif.created_at)}</p>
              </div>
              {!notif.is_read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-6 w-6 text-muted-foreground hover:text-primary mt-0.5"
                  onClick={(e) => {
                    e.preventDefault();
                    markRead.mutate(notif.id);
                  }}
                  disabled={markRead.isPending}
                  title="Mark as read"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))
        )}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full text-xs h-8"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/notifications";
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
