import React from "react";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { EsgScoreTrend } from "../schema";
import { Skeleton } from "../../../shared/components/ui/skeleton";

export type KpiVariant = "overall" | "environmental" | "social" | "governance";

const variantConfig: Record<
  KpiVariant,
  { label: string; gradient: string; iconBg: string; textColor: string }
> = {
  overall: {
    label: "Overall ESG Score",
    gradient: "from-primary/10 to-primary/5 border-primary/20",
    iconBg: "bg-primary/10",
    textColor: "text-primary",
  },
  environmental: {
    label: "Environmental",
    gradient: "from-environmental/10 to-environmental/5 border-environmental/20",
    iconBg: "bg-environmental/10",
    textColor: "text-environmental",
  },
  social: {
    label: "Social",
    gradient: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    iconBg: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  governance: {
    label: "Governance",
    gradient: "from-violet-500/10 to-violet-500/5 border-violet-500/20",
    iconBg: "bg-violet-500/10",
    textColor: "text-violet-600 dark:text-violet-400",
  },
};

interface KpiCardProps {
  variant: KpiVariant;
  trend: EsgScoreTrend;
  isLoading?: boolean;
}

export function KpiCard({ variant, trend, isLoading = false }: KpiCardProps) {
  const config = variantConfig[variant];

  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-2xl" />;
  }

  const delta = trend.delta;
  const hasDelta = delta !== null && delta !== undefined;

  return (
    <Card
      className={cn(
        "border bg-gradient-to-br rounded-2xl transition-shadow duration-200 hover:shadow-md",
        config.gradient
      )}
    >
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              {config.label}
            </p>
            <p className={cn("text-4xl font-extrabold tabular-nums", config.textColor)}>
              {trend.current.toFixed(1)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">out of 100</p>
          </div>

          {/* Trend arrow */}
          {hasDelta && (
            <div
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-bold",
                delta! > 0
                  ? "bg-environmental/10 text-environmental"
                  : delta! < 0
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {delta! > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : delta! < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>
                {delta! > 0 ? "+" : ""}
                {delta!.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {trend.previous !== null && trend.previous !== undefined && (
          <p className="text-[10px] text-muted-foreground mt-2">
            Previous period: {trend.previous.toFixed(1)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
