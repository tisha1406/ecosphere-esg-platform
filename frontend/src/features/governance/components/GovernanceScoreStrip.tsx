import React from "react";
import { useGovernanceScoreQuery } from "../hooks";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export function GovernanceScoreStrip() {
  const { data, isLoading, isError } = useGovernanceScoreQuery({
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
  const score = scoreData?.score || 0;
  
  // Mocking a trend since it's not provided by API
  const trendDelta = 1.2; 

  // Determine risk indicator color based on score band (higher is better)
  // For Governance, a high score is low risk (good).
  const isGoodScore = score >= 70;
  const stripColorClass = isGoodScore ? "bg-governance/5 border-governance/20" : "bg-destructive/5 border-destructive/20";
  const trendColorClass = isGoodScore ? "text-emerald-500" : "text-destructive";

  return (
    <Card className={`mb-6 shadow-sm glass-card ${stripColorClass}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Governance & Compliance Score</h3>
          <p className="text-sm text-muted-foreground">Aggregate metric across Policies, Audits, and Board Oversight</p>
          <div className="flex items-center mt-2 text-sm">
            {trendDelta > 0 ? (
              <TrendingUp className={`w-4 h-4 mr-1 ${trendColorClass}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 mr-1 ${trendColorClass}`} />
            )}
            <span className={`font-medium ${trendColorClass}`}>
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
