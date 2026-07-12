import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { EsgScoreBlock } from "../schema";

interface ScoreGaugesProps {
  scores?: EsgScoreBlock;
  isLoading?: boolean;
}

const gaugeConfig = [
  { key: "environmental" as const, label: "Environmental", color: "environmental" },
  { key: "social" as const, label: "Social", color: "social" },
  { key: "governance" as const, label: "Governance", color: "governance" },
];

export function ScoreGauges({ scores, isLoading = false }: ScoreGaugesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ESG Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-around gap-4 py-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-32 h-32 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Pillar Scores</CardTitle>
        <CardDescription>
          {scores?.period ? `Period: ${scores.period}` : "Current period overview"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-around gap-6 py-4">
          {gaugeConfig.map(({ key, label }) => {
            const score = scores?.[key]?.current ?? 0;
            return (
              <div key={key} className="flex flex-col items-center gap-2">
                <ScoreGauge
                  score={Math.round(score)}
                  maxScore={100}
                  label={label}
                  size="md"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
