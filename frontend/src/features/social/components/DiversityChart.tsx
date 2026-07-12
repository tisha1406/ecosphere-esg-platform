import React from "react";
import { useDiversityQuery } from "../hooks";
import { DiversityMetric } from "../schema";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { Skeleton } from "../../../shared/components/ui/skeleton";

export function DiversityChart() {
  const { data, isLoading } = useDiversityQuery({ page: 1, page_size: 50 });

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  const metrics: DiversityMetric[] = data?.data?.items || [];

  // Aggregate by department_id — show latest metric per dept
  const byDept = metrics.reduce<Record<string, DiversityMetric>>((acc, m) => {
    if (!acc[m.department_id] || m.period > acc[m.department_id].period) {
      acc[m.department_id] = m;
    }
    return acc;
  }, {});

  const chartData = Object.values(byDept).map((m) => ({
    name: m.department_id.slice(0, 8) + "…",
    "Gender Ratio (%)": Math.round(m.gender_ratio * 100),
    "Inclusion Score": Math.round(m.inclusion_score),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No diversity data available yet.
      </div>
    );
  }

  return (
    <ChartWidget
      title="Diversity by Department"
      description="Gender ratio (%) and inclusion score per department"
      data={chartData}
      type="bar"
      xKey="name"
      height={300}
      series={[
        { key: "Gender Ratio (%)", name: "Gender Ratio (%)", color: "hsl(221, 83%, 53%)" },
        { key: "Inclusion Score", name: "Inclusion Score", color: "hsl(142, 76%, 36%)" },
      ]}
    />
  );
}
