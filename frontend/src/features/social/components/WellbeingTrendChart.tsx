import React from "react";
import { useWellbeingQuery } from "../hooks";
import { WellbeingRecord } from "../schema";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { Skeleton } from "../../../shared/components/ui/skeleton";

export function WellbeingTrendChart() {
  const { data, isLoading } = useWellbeingQuery({ page: 1, page_size: 100 });

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  const records: WellbeingRecord[] = data?.data?.items || [];

  // Group by survey_date and compute average satisfaction
  const grouped = records.reduce<Record<string, number[]>>((acc, r) => {
    const dateKey = r.survey_date.slice(0, 7); // YYYY-MM
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(r.satisfaction_score);
    return acc;
  }, {});

  const chartData = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scores]) => ({
      name: date,
      "Avg Satisfaction": parseFloat(
        (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)
      ),
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No wellbeing survey data available yet.
      </div>
    );
  }

  return (
    <ChartWidget
      title="Employee Wellbeing Trend"
      description="Average monthly satisfaction score across all surveys"
      data={chartData}
      type="line"
      xKey="name"
      height={300}
      series={[
        {
          key: "Avg Satisfaction",
          name: "Avg Satisfaction (0–10)",
          color: "hsl(221, 83%, 53%)",
        },
      ]}
    />
  );
}
