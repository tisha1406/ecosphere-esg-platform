import React, { useState } from "react";
import { useLeaderboardQuery } from "../hooks";
import { LeaderboardEntry } from "../schema";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Trophy, Medal, Filter } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { Select } from "../../../shared/components/ui/select";

const medalConfig: Record<number, { icon: React.ReactNode; bg: string; text: string }> = {
  1: {
    icon: <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-md" />,
    bg: "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200/50 dark:border-yellow-800/50 shadow-sm",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  2: {
    icon: <Medal className="w-5 h-5 text-slate-400 drop-shadow-sm" />,
    bg: "bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-700/50",
    text: "text-slate-600 dark:text-slate-400",
  },
  3: {
    icon: <Medal className="w-5 h-5 text-amber-700 drop-shadow-sm" />,
    bg: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/50",
    text: "text-amber-700 dark:text-amber-500",
  },
};

export function LeaderboardTable() {
  const [period, setPeriod] = useState("all-time");
  const { data, isLoading } = useLeaderboardQuery({ period, limit: 20 });

  const entries: LeaderboardEntry[] = data?.data?.entries || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          Global Rankings
        </h3>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-[140px] h-8 text-xs bg-background/50 glass-card">
          <option value="all-time">All-Time</option>
          <option value="quarter">This Quarter</option>
          <option value="month">This Month</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Complete activities to earn points and join the leaderboard."
          icon={<Trophy className="w-8 h-8 text-muted-foreground" />}
          className="py-16 bg-card/50 rounded-lg border border-border/50 border-dashed"
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const medal = medalConfig[rank];
            const maxPoints = Math.max(entries[0]?.total_points || 1, 1);
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
                  "flex items-center gap-4 px-5 py-3 rounded-xl border transition-all duration-300 hover:shadow-md glass-card",
                  medal ? medal.bg : "bg-card/40 border-border/50 hover:border-orange-500/30"
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
                <Avatar className={cn("shrink-0", rank === 1 ? "h-12 w-12 border-2 border-yellow-400" : "h-10 w-10")}>
                  {entry.avatar_url && <AvatarImage src={entry.avatar_url} />}
                  <AvatarFallback
                    className={cn(
                      "text-sm font-bold",
                      medal ? medal.text : "bg-orange-500/10 text-orange-500"
                    )}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Name + Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn("font-semibold truncate text-sm", medal && medal.text, rank === 1 && "text-base")}>
                      {entry.full_name}
                    </p>
                    <span className="text-sm font-bold tabular-nums ml-2 shrink-0 flex items-center gap-1">
                      <span className={rank === 1 ? "text-yellow-600 dark:text-yellow-400" : ""}>
                        {entry.total_points.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-xs font-medium">pts</span>
                    </span>
                  </div>
                  {/* Progress bar toward top score */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        rank === 1
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : rank === 2
                          ? "bg-slate-400"
                          : rank === 3
                          ? "bg-amber-600"
                          : "bg-orange-500"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
