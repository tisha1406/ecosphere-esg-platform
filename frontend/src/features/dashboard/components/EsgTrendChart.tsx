import React from "react";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { EsgScoreBlock } from "../schema";

interface EsgTrendChartProps {
  scores?: EsgScoreBlock;
  isLoading?: boolean;
}

export function EsgTrendChart({ scores, isLoading = false }: EsgTrendChartProps) {
  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  // Build a two-point trend series (previous → current) if previous data exists
  const hasPrev =
    scores?.environmental.previous !== null &&
    scores?.environmental.previous !== undefined;

  const chartData = hasPrev
    ? [
        {
          name: "Previous",
          Environmental: scores!.environmental.previous ?? 0,
          Social: scores!.social.previous ?? 0,
          Governance: scores!.governance.previous ?? 0,
        },
        {
          name: scores?.period ?? "Current",
          Environmental: scores!.environmental.current,
          Social: scores!.social.current,
          Governance: scores!.governance.current,
        },
      ]
    : [
        {
          name: scores?.period ?? "Current",
          Environmental: scores?.environmental.current ?? 0,
          Social: scores?.social.current ?? 0,
          Governance: scores?.governance.current ?? 0,
        },
      ];

  return (
    <ChartWidget
      title="ESG Score Trends"
      description="Environmental, Social and Governance scores over time"
      data={chartData}
      type="line"
      xKey="name"
      height={280}
      series={[
        { key: "Environmental", name: "Environmental", color: "hsl(142, 76%, 36%)" },
        { key: "Social", name: "Social", color: "hsl(221, 83%, 53%)" },
        { key: "Governance", name: "Governance", color: "hsl(270, 60%, 55%)" },
      ]}
    />
  );
}
