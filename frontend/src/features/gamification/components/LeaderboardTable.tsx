import React from "react";
import { useLeaderboardQuery } from "../hooks";
import { LeaderboardEntry } from "../schema";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Avatar, AvatarFallback } from "../../../shared/components/ui/avatar";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Trophy, Medal } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

const medalConfig: Record<number, { icon: React.ReactNode; bg: string; text: string }> = {
  1: {
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
    bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  2: {
    icon: <Medal className="w-5 h-5 text-slate-400" />,
    bg: "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700",
    text: "text-slate-600 dark:text-slate-400",
  },
  3: {
    icon: <Medal className="w-5 h-5 text-amber-700" />,
    bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-500",
  },
};

interface LeaderboardTableProps {
  period?: string;
  limit?: number;
  entries?: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({ period = "all-time", limit = 20, entries: propEntries, isLoading: propIsLoading }: LeaderboardTableProps) {
  const { data, isLoading: queryIsLoading } = useLeaderboardQuery({ period, limit }, { enabled: !propEntries });

  const entries: LeaderboardEntry[] = propEntries || (data as any)?.entries || [];
  const isLoading = propIsLoading !== undefined ? propIsLoading : queryIsLoading;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Trophy className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No entries yet</p>
        <p className="text-sm">Complete ESG activities to earn points and join the leaderboard.</p>
      </div>
    );
  }

  // Determine max points for progress bar calculation
  const maxPoints = entries[0]?.total_points || 1;

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const rank = index + 1;
        const medal = medalConfig[rank];
        const progress = Math.round((entry.total_points / maxPoints) * 100);
        const initials = entry.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div
            key={entry.user_id}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-sm",
              medal ? medal.bg : "bg-card border-border hover:border-primary/20"
            )}
          >
            {/* Rank */}
            <div className="w-8 flex items-center justify-center shrink-0">
              {medal ? (
                medal.icon
              ) : (
                <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold",
                  medal ? medal.text : "bg-primary/10 text-primary"
                )}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name + Progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className={cn("font-semibold truncate text-sm", medal && medal.text)}>
                  {entry.full_name}
                </p>
                <span className="text-sm font-bold tabular-nums ml-2 shrink-0">
                  {entry.total_points.toLocaleString()} pts
                </span>
              </div>
              {/* Progress bar toward top score */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    rank === 1
                      ? "bg-yellow-500"
                      : rank === 2
                      ? "bg-slate-400"
                      : rank === 3
                      ? "bg-amber-600"
                      : "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
