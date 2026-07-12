import React from "react";
import { PageHeader } from "../../../shared/components/PageHeader";
import { mockDashboardSummary } from "../mock";
import { KpiCard } from "../../../shared/components/KpiCard";
import { ScoreGauges } from "../components/ScoreGauges";
import { ActivityStats } from "../components/ActivityStats";
import { EsgTrendChart } from "../components/EsgTrendChart";
import { LeaderboardTable } from "../../gamification/components/LeaderboardTable";
import { NotificationsList } from "../components/NotificationsList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { Leaf, Sparkles, Trophy } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

export function DashboardPage() {
  const summary = mockDashboardSummary;
  const scores = summary.scores;
  const activity = summary.activity;
  const contributors = summary.top_contributors;
  const notifications = summary.recent_notifications;
  const isLoading = false;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <PageHeader 
        title="ESG Dashboard" 
        description={`Static demo data · ${scores.period}`}
        icon={<Leaf className="w-6 h-6 text-environmental" />}
        iconBg="bg-gradient-to-br from-primary/20 to-environmental/10"
      >
        <Button variant="outline" size="sm" disabled className="gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Demo data
        </Button>
      </PageHeader>

      {/* ── Hero KPI Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard 
          title="Overall ESG Score" 
          value={scores.overall.current.toFixed(1)} 
          variant="overall" 
          trend={{ value: scores.overall.delta || 0, label: "vs last period", isPositive: (scores.overall.delta || 0) >= 0 }} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Environmental" 
          value={scores.environmental.current.toFixed(1)} 
          variant="environmental" 
          trend={{ value: scores.environmental.delta || 0, label: "vs last period", isPositive: (scores.environmental.delta || 0) >= 0 }} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Social" 
          value={scores.social.current.toFixed(1)} 
          variant="social" 
          trend={{ value: scores.social.delta || 0, label: "vs last period", isPositive: (scores.social.delta || 0) >= 0 }} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Governance" 
          value={scores.governance.current.toFixed(1)} 
          variant="governance" 
          trend={{ value: scores.governance.delta || 0, label: "vs last period", isPositive: (scores.governance.delta || 0) >= 0 }} 
          isLoading={isLoading} 
        />
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
