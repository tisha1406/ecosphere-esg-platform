import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { ActivityCounts } from "../schema";
import { ShieldCheck, ClipboardList, Users, Flame } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

interface ActivityStat {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}

interface ActivityStatsProps {
  activity?: ActivityCounts;
  isLoading?: boolean;
}

export function ActivityStats({ activity, isLoading = false }: ActivityStatsProps) {
  const stats: ActivityStat[] = [
    {
      label: "Open Policies",
      value: activity?.open_policies ?? 0,
      icon: <ShieldCheck className="w-5 h-5" />,
      accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Pending Audits",
      value: activity?.pending_audits ?? 0,
      icon: <ClipboardList className="w-5 h-5" />,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Active CSR Initiatives",
      value: activity?.active_csr_initiatives ?? 0,
      icon: <Users className="w-5 h-5" />,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Emissions This Month",
      value:
        activity !== undefined
          ? `${activity.emissions_this_month_tco2e.toLocaleString(undefined, { maximumFractionDigits: 1 })} tCO₂e`
          : "0 tCO₂e",
      icon: <Flame className="w-5 h-5" />,
      accent: "text-environmental dark:text-environmental bg-environmental/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) =>
        isLoading ? (
          <Skeleton key={s.label} className="h-24 rounded-xl" />
        ) : (
          <Card key={s.label} className="border">
            <CardContent className="pt-4 pb-3 px-4 flex flex-col gap-2">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.accent)}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-xl font-bold tabular-nums">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
