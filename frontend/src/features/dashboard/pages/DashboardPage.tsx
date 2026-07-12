import React from "react";
import { useDashboardSummary } from "../hooks";
import { KpiCard } from "../components/KpiCard";
import { ScoreGauges } from "../components/ScoreGauges";
import { ActivityStats } from "../components/ActivityStats";
import { EsgTrendChart } from "../components/EsgTrendChart";
import { LeaderboardTable } from "../../gamification/components/LeaderboardTable";
import { NotificationsList } from "../components/NotificationsList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Leaf, RefreshCw, Trophy } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

export function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardSummary("default");

  const summary = data?.data?.data;
  const scores = summary?.scores;
  const activity = summary?.activity;
  const contributors = summary?.top_contributors ?? [];
  const notifications = summary?.recent_notifications ?? [];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-environmental/10">
            <Leaf className="w-6 h-6 text-environmental" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-environmental via-primary to-blue-500 bg-clip-text text-transparent">
              ESG Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Live cross-module overview · {scores?.period ?? "—"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load dashboard data. Please try refreshing.
        </div>
      )}

      {/* ── Hero KPI Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard variant="overall" trend={scores?.overall ?? { current: 0, previous: null, delta: null }} isLoading={isLoading} />
        <KpiCard variant="environmental" trend={scores?.environmental ?? { current: 0, previous: null, delta: null }} isLoading={isLoading} />
        <KpiCard variant="social" trend={scores?.social ?? { current: 0, previous: null, delta: null }} isLoading={isLoading} />
        <KpiCard variant="governance" trend={scores?.governance ?? { current: 0, previous: null, delta: null }} isLoading={isLoading} />
      </div>

      {/* ── Activity Counts Strip ─────────────────────────────────────────── */}
      <ActivityStats activity={activity} isLoading={isLoading} />

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: score gauges + trend chart */}
        <div className="lg:col-span-2 space-y-6">
          <ScoreGauges scores={scores} isLoading={isLoading} />
          <EsgTrendChart scores={scores} isLoading={isLoading} />
        </div>

        {/* Right column: top contributors + notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Top Contributors
              </CardTitle>
              <CardDescription>Ranked by lifetime ESG activity points</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable limit={5} entries={contributors as any} isLoading={isLoading} />
            </CardContent>
          </Card>
          <NotificationsList notifications={notifications} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
