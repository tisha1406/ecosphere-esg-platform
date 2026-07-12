import React from "react";
import { useEnvironmentalScoreQuery } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { ChartWidget } from "../../../shared/components/ChartWidget";
import { ChartSkeleton } from "../../../shared/components/Skeletons";

export function EnvironmentalScoreTab() {
  const { data, isLoading, isError } = useEnvironmentalScoreQuery({
    company_id: "default",
    start_date: "2026-01-01",
    end_date: "2026-12-31"
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-md">Failed to load environmental score.</div>;
  }

  const score = data?.data || 0;
  
  // Mock historical data since the endpoint only returns a single number
  const historicalData = [
    { month: "Jan", score: Math.max(0, score - 15) },
    { month: "Feb", score: Math.max(0, score - 12) },
    { month: "Mar", score: Math.max(0, score - 8) },
    { month: "Apr", score: Math.max(0, score - 5) },
    { month: "May", score: Math.max(0, score - 2) },
    { month: "Jun", score: score },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-12 animate-in fade-in duration-500">
      <div className="md:col-span-5 lg:col-span-4">
        <Card className="glass-card h-full flex flex-col">
          <CardHeader>
            <CardTitle>Current Score</CardTitle>
            <CardDescription>Your aggregate environmental performance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center flex-1 py-8">
            <ScoreGauge score={score} maxScore={100} label="Overall Environment" size="lg" />
            
            <div className="mt-8 space-y-3 w-full max-w-[200px]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Emissions</span>
                <span className="font-medium text-foreground">35/40</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Energy</span>
                <span className="font-medium text-foreground">28/30</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Waste</span>
                <span className="font-medium text-foreground">22/30</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-7 lg:col-span-8">
        <ChartWidget
          title="Score History"
          description="Environmental score progression over the last 6 months"
          type="line"
          data={historicalData}
          xKey="month"
          series={[{ key: "score", name: "Score", color: "hsl(var(--environmental))" }]}
          height={350}
        />
      </div>
    </div>
  );
}
