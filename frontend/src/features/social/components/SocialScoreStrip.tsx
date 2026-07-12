import React from "react";
import { useSocialScoreQuery } from "../hooks";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export function SocialScoreStrip() {
  const { data, isLoading, isError } = useSocialScoreQuery({
    company_id: "default",
    start_date: "2026-01-01",
    end_date: "2026-12-31"
  });

  if (isLoading) {
    return <Skeleton className="h-24 w-full mb-6 rounded-xl" />;
  }

  if (isError) {
    return null;
  }

  const scoreData = data?.data;
  const score = scoreData?.composite_score || 0;
  // Mocking a trend since it's not provided by API
  const trendDelta = 2.4; 

  return (
    <Card className="mb-6 bg-social/5 border-social/20 shadow-sm glass-card">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Social Performance Score</h3>
          <p className="text-sm text-muted-foreground">Aggregate metric across CSR, Wellbeing, and Diversity</p>
          <div className="flex items-center mt-2 text-sm">
            {trendDelta > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive mr-1" />
            )}
            <span className={trendDelta > 0 ? "text-emerald-500 font-medium" : "text-destructive font-medium"}>
              +{trendDelta} points
            </span>
            <span className="text-muted-foreground ml-1">vs last quarter</span>
          </div>
        </div>
        <div className="w-32 h-20">
          <ScoreGauge score={score} maxScore={100} size="sm" hideLabel />
        </div>
      </CardContent>
    </Card>
  );
}
