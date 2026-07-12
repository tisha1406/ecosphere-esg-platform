import React from "react";
import { useGovernanceScoreQuery } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { Skeleton } from "../../../shared/components/ui/skeleton";

export function GovernanceScoreCard() {
  const { data, isLoading, isError } = useGovernanceScoreQuery({
    start_date: "2026-01-01",
    end_date: "2026-12-31"
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError) return <div className="text-red-500">Failed to load score.</div>;

  const score = data?.data || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance Score</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <ScoreGauge score={score} maxScore={100} label="Overall Governance" size="lg" />
      </CardContent>
    </Card>
  );
}
