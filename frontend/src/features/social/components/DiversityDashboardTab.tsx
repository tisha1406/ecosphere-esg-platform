import React, { useMemo } from "react";
import { useDiversityQuery } from "../hooks";
import { KpiCard } from "../../../shared/components/KpiCard";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { Users, HeartHandshake } from "lucide-react";
import { KpiSkeleton, ChartSkeleton } from "../../../shared/components/Skeletons";

export function DiversityDashboardTab() {
  const { data, isLoading } = useDiversityQuery({ page_size: 100 });

  const stats = useMemo(() => {
    if (!data?.data?.items) return null;
    const metrics = data.data.items;

    // Get latest metric per department
    const latestByDept = metrics.reduce((acc: any, m: any) => {
      if (!acc[m.department_id] || m.period > acc[m.department_id].period) {
        acc[m.department_id] = m;
      }
      return acc;
    }, {});

    const latestMetrics = Object.values(latestByDept) as any[];
    
    const avgInclusionScore = latestMetrics.reduce((sum, m) => sum + m.inclusion_score, 0) / (latestMetrics.length || 1);
    const avgGenderRatio = latestMetrics.reduce((sum, m) => sum + m.gender_ratio, 0) / (latestMetrics.length || 1);

    const genderChartData = [
      { name: "Female", value: Math.round(avgGenderRatio * 100) },
      { name: "Male", value: 100 - Math.round(avgGenderRatio * 100) }
    ];

    const inclusionChartData = latestMetrics.map((m) => ({
      name: m.department_id.slice(0, 8) + "…",
      "Inclusion Score": Math.round(m.inclusion_score),
    }));

    return {
      avgInclusionScore,
      avgGenderRatio,
      genderChartData,
      inclusionChartData
    };
  }, [data]);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Average Inclusion Score"
          value={`${stats.avgInclusionScore.toFixed(1)}/100`}
          icon={<HeartHandshake className="h-5 w-5" />}
          trend={{ value: 2.1, label: "vs last period", isPositive: true }}
        />
        <KpiCard
          title="Average Female Representation"
          value={`${(stats.avgGenderRatio * 100).toFixed(1)}%`}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 0.5, label: "vs last period", isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartWidget
          title="Gender Diversity"
          description="Average gender distribution across all departments"
          type="donut"
          data={stats.genderChartData}
          series={[
            { key: "Female", name: "Female", color: "hsl(var(--social))" },
            { key: "Male", name: "Male", color: "hsl(var(--muted-foreground))" }
          ]}
        />
        <ChartWidget
          title="Inclusion Score by Department"
          description="Latest inclusion scores per department"
          type="bar"
          data={stats.inclusionChartData}
          xKey="name"
          series={[{ key: "Inclusion Score", name: "Score", color: "hsl(var(--social))" }]}
        />
      </div>
    </div>
  );
}
