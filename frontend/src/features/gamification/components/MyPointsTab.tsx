import React from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useUserPointsQuery } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { PointsHistoryList } from "./PointsHistoryList";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { Skeleton } from "../../../shared/components/ui/skeleton";

// Presentational Threshold Table for derived Level System
// Level N requires Level N points.
const LEVEL_THRESHOLDS = [
  { level: 1, name: "Eco Novice", minPoints: 0 },
  { level: 2, name: "Green Participant", minPoints: 100 },
  { level: 3, name: "Sustainability Champion", minPoints: 300 },
  { level: 4, name: "ESG Leader", minPoints: 600 },
  { level: 5, name: "Planet Guardian", minPoints: 1000 },
  { level: 6, name: "Global Ambassador", minPoints: 1500 },
];

function deriveLevelInfo(totalPoints: number) {
  let currentLevelIndex = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].minPoints) {
      currentLevelIndex = i;
    } else {
      break;
    }
  }

  const currentLevel = LEVEL_THRESHOLDS[currentLevelIndex];
  const nextLevel = LEVEL_THRESHOLDS[currentLevelIndex + 1] || null;

  const pointsInCurrentLevel = totalPoints - currentLevel.minPoints;
  const pointsNeededForNext = nextLevel ? nextLevel.minPoints - currentLevel.minPoints : 0;
  const progressPercent = nextLevel ? Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNext) * 100)) : 100;

  return { currentLevel, nextLevel, progressPercent, pointsInCurrentLevel, pointsNeededForNext };
}

export function MyPointsTab() {
  const { user } = useAuth();
  const { data, isLoading } = useUserPointsQuery(user?.id || "");

  if (!user?.id) {
    return <div className="p-8 text-center text-muted-foreground">User session required.</div>;
  }

  const totalPoints = data?.data?.total_points || 0;
  const { currentLevel, nextLevel, progressPercent, pointsNeededForNext } = deriveLevelInfo(totalPoints);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Level Progress Overview */}
      <Card className="lg:col-span-1 glass-card border-orange-500/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <Trophy className="w-5 h-5" /> Current Level
          </CardTitle>
          <CardDescription>Your progression derived from total points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <>
              <div className="text-center p-6 bg-gradient-to-b from-orange-500/10 to-orange-500/5 rounded-2xl border border-orange-500/20 relative overflow-hidden">
                <Star className="w-24 h-24 text-orange-500/10 absolute -top-4 -right-4" />
                <div className="relative z-10">
                  <span className="text-sm font-bold text-orange-500 uppercase tracking-widest block mb-1">
                    Level {currentLevel.level}
                  </span>
                  <h3 className="text-3xl font-black text-foreground mb-1">{currentLevel.name}</h3>
                  <p className="text-2xl font-bold tabular-nums text-muted-foreground mt-2">
                    {totalPoints.toLocaleString()} <span className="text-sm font-medium">pts</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Progress to Level {nextLevel?.level || currentLevel.level}</span>
                  <span className="text-foreground">{progressPercent}%</span>
                </div>
                <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {nextLevel ? (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    {totalPoints.toLocaleString()} / {nextLevel.minPoints.toLocaleString()} pts to unlock <strong>{nextLevel.name}</strong>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    Maximum level achieved!
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* History Feed */}
      <Card className="lg:col-span-2 glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Points History
          </CardTitle>
          <CardDescription>A chronological feed of all your ESG contributions and rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <PointsHistoryList userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
