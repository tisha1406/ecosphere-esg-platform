import React from "react";
import { useUserPointsQuery } from "../hooks";
import { PointsHistoryEntry } from "../schema";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Badge } from "../../../shared/components/ui/badge";
import {
  Leaf,
  Users,
  ShieldCheck,
  Trophy,
  Zap,
  Package,
} from "lucide-react";
import { cn } from "../../../shared/lib/utils";

// Map source_table names to icons
const sourceIconMap: Record<string, React.ReactNode> = {
  carbon_emissions: <Leaf className="w-4 h-4 text-environmental" />,
  energy_usages: <Zap className="w-4 h-4 text-yellow-500" />,
  waste_trackings: <Package className="w-4 h-4 text-orange-500" />,
  employee_wellbeing: <Users className="w-4 h-4 text-blue-500" />,
  csr_initiatives: <Users className="w-4 h-4 text-blue-600" />,
  diversity_metrics: <Users className="w-4 h-4 text-purple-500" />,
  compliance_audits: <ShieldCheck className="w-4 h-4 text-slate-500" />,
  board_activities: <ShieldCheck className="w-4 h-4 text-slate-600" />,
  manual_adjustment: <Trophy className="w-4 h-4 text-amber-500" />,
};

function getSourceIcon(source: string): React.ReactNode {
  return (
    sourceIconMap[source] ?? <Trophy className="w-4 h-4 text-muted-foreground" />
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface PointsHistoryListProps {
  userId: string;
}

export function PointsHistoryList({ userId }: PointsHistoryListProps) {
  const { data, isLoading } = useUserPointsQuery(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  const history: PointsHistoryEntry[] = data?.data?.history || [];
  const totalPoints: number = data?.data?.total_points || 0;

  return (
    <div className="space-y-4">
      {/* Total points summary banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <div>
          <p className="text-sm text-muted-foreground font-medium">Total Points Earned</p>
          <p className="text-3xl font-bold text-primary tabular-nums">
            {totalPoints.toLocaleString()}
          </p>
        </div>
        <Trophy className="w-10 h-10 text-primary/40" />
      </div>

      {/* History feed */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Trophy className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No points activity yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors duration-150"
            >
              {/* Source icon */}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                {getSourceIcon(entry.source_table)}
              </div>

              {/* Reason & meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.reason}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {entry.source_table.replace(/_/g, " ")}
                </p>
              </div>

              {/* Points & time */}
              <div className="text-right shrink-0">
                <Badge
                  variant={entry.points >= 0 ? "default" : "outline"}
                  className={cn(
                    "font-bold tabular-nums",
                    entry.points >= 0
                      ? "bg-environmental/10 text-environmental border-environmental/20"
                      : "text-destructive border-destructive/30"
                  )}
                >
                  {entry.points >= 0 ? "+" : ""}
                  {entry.points} pts
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatRelativeTime(entry.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
