import React, { useMemo } from "react";
import { useEmissionsQuery, useEnergyQuery, useWasteQuery, useEnvironmentalScoreQuery } from "../hooks";
import { KpiCard } from "../../../shared/components/KpiCard";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { Cloud, Zap, Recycle, LeafyGreen } from "lucide-react";
import { KpiSkeleton, ChartSkeleton } from "../../../shared/components/Skeletons";

export function EnvironmentalDashboardTab() {
  const { data: emissionsData, isLoading: emLoading } = useEmissionsQuery({ page_size: 100 });
  const { data: energyData, isLoading: enLoading } = useEnergyQuery({ page_size: 100 });
  const { data: wasteData, isLoading: wLoading } = useWasteQuery({ page_size: 100 });
  const { data: scoreData, isLoading: scLoading } = useEnvironmentalScoreQuery({
    company_id: "default",
    start_date: "2026-01-01",
    end_date: "2026-12-31"
  });

  const isLoading = emLoading || enLoading || wLoading || scLoading;

  const stats = useMemo(() => {
    if (isLoading) return null;

    const emissions = emissionsData?.data?.items || [];
    const energy = energyData?.data?.items || [];
    const waste = wasteData?.data?.items || [];

    const totalEmissions = emissions.reduce((sum: number, item: any) => sum + Number(item.value_tco2e || 0), 0);
    const totalEnergy = energy.reduce((sum: number, item: any) => sum + Number(item.kwh_consumed || 0), 0);
    
    const totalRecycled = waste.reduce((sum: number, item: any) => sum + Number(item.kg_recycled || 0), 0);
    const totalLandfill = waste.reduce((sum: number, item: any) => sum + Number(item.kg_landfill || 0), 0);
    const totalWaste = totalRecycled + totalLandfill;
    const wasteDiverted = totalWaste > 0 ? (totalRecycled / totalWaste) * 100 : 0;

    // Group emissions by scope for chart
    const emissionsByScope = emissions.reduce((acc: any, curr: any) => {
      const scope = curr.scope.replace("_", " ");
      acc[scope] = (acc[scope] || 0) + Number(curr.value_tco2e);
      return acc;
    }, {});
    const scopeChartData = Object.keys(emissionsByScope).map(key => ({
      name: key,
      value: emissionsByScope[key]
    }));

    // Group emissions by month for trend
    const emissionsByMonth = emissions.reduce((acc: any, curr: any) => {
      const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(curr.value_tco2e);
      return acc;
    }, {});
    const trendChartData = Object.keys(emissionsByMonth).map(key => ({
      name: key,
      emissions: emissionsByMonth[key]
    }));

    return {
      totalEmissions,
      totalEnergy,
      wasteDiverted,
      score: scoreData?.data || 0,
      scopeChartData,
      trendChartData
    };
  }, [emissionsData, energyData, wasteData, scoreData, isLoading]);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiSkeleton />
          <KpiSkeleton />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Emissions"
          value={`${stats.totalEmissions.toFixed(1)} tCO2e`}
          icon={<Cloud className="h-5 w-5" />}
          trend={{ value: 2.4, label: "vs last month", isPositive: false }}
        />
        <KpiCard
          title="Energy Consumed"
          value={`${stats.totalEnergy.toFixed(0)} kWh`}
          icon={<Zap className="h-5 w-5" />}
          trend={{ value: 5.1, label: "vs last month", isPositive: false }}
        />
        <KpiCard
          title="Waste Diverted"
          value={`${stats.wasteDiverted.toFixed(1)}%`}
          icon={<Recycle className="h-5 w-5" />}
          trend={{ value: 1.2, label: "vs last month", isPositive: true }}
        />
        <KpiCard
          title="Env Score"
          value={stats.score}
          icon={<LeafyGreen className="h-5 w-5" />}
          trend={{ value: 4, label: "vs last year", isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartWidget
          title="Emissions Trend"
          description="Monthly tCO2e output across all scopes"
          type="line"
          data={stats.trendChartData}
          series={[{ key: "emissions", name: "Emissions", color: "hsl(var(--environmental))" }]}
        />
        <ChartWidget
          title="Emissions by Scope"
          description="Distribution of tCO2e by scope"
          type="bar"
          data={stats.scopeChartData}
          series={[{ key: "value", name: "tCO2e", color: "hsl(var(--primary))" }]}
        />
      </div>
    </div>
  );
}
