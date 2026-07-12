import React from "react";
import { useSocialScoreQuery } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { Skeleton } from "../../../shared/components/ui/skeleton";

export function SocialScoreCard() {
  const { data, isLoading, isError } = useSocialScoreQuery({
    company_id: "default",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError)
    return <div className="text-destructive text-sm">Failed to load social score.</div>;

  const score = data?.data?.composite_score ?? data?.data ?? 0;
  const numScore = typeof score === "number" ? score : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Score</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <ScoreGauge score={Math.round(numScore)} maxScore={100} label="Social ESG Score" size="lg" />
      </CardContent>
    </Card>
  );
}
