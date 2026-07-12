import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { LeaderboardTable } from "../components/LeaderboardTable";
import { BadgeGrid } from "../components/BadgeGrid";
import { PointsHistoryList } from "../components/PointsHistoryList";
import { useUserPointsQuery } from "../hooks";
import { mockChallenges, mockRewardCards, mockLeaderboardEntries } from "../mock";
import { Badge } from "../../../shared/components/ui/badge";
import { Plus, Trophy, Star, Zap, BadgeCheck, Gift, Rocket, TrendingUp, Users, CalendarDays } from "lucide-react";

const tabs = [
  { value: "challenges", label: "Challenges" },
  { value: "participation", label: "Challenge Participation" },
  { value: "badges", label: "Badges" },
  { value: "rewards", label: "Rewards" },
  { value: "leaderboard", label: "Leaderboard" },
];

export function GamificationPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("challenges");

  // Fetch current user's points for BadgeGrid progress bars
  const { data: myPointsData } = useUserPointsQuery(user?.id || "");
  const myTotalPoints = myPointsData?.data?.total_points || 0;

  return (
    <div className="flex-1 space-y-5 p-6 md:p-8 pt-6 bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
            <Rocket className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Gamification</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Challenges, badges, rewards, and leaderboard activity using mock data only.
            </p>
          </div>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "outline"}
            className={
              activeTab === tab.value
                ? "justify-start bg-orange-500 hover:bg-orange-600 text-white"
                : "justify-start border-muted-foreground/20 text-muted-foreground"
            }
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Draft", className: "border-slate-500/40 text-slate-300" },
          { label: "Active", className: "border-green-500/50 text-green-400" },
          { label: "Under Review", className: "border-violet-500/50 text-violet-300" },
          { label: "Completed", className: "border-blue-500/50 text-blue-300" },
          { label: "Archived", className: "border-slate-400/40 text-slate-400" },
        ].map((item) => (
          <Badge key={item.label} variant="outline" className={`rounded-md px-4 py-1.5 ${item.className}`}>
            {item.label}
          </Badge>
        ))}
      </div>

      {/* Main layout */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {mockChallenges.map((challenge) => (
              <Card key={challenge.id} className={`border-2 bg-card/70 shadow-sm ${challenge.accent}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-orange-500" />
                        {challenge.title}
                      </CardTitle>
                      <CardDescription className="mt-1">XP: {challenge.xp} · {challenge.difficulty}</CardDescription>
                    </div>
                    <Badge variant={challenge.status === "Active" ? "default" : "secondary"} className="capitalize">
                      {challenge.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Deadline {challenge.deadline}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {challenge.participants}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                      style={{ width: `${challenge.status === "Active" ? 72 : challenge.status === "Draft" ? 28 : 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-md">{challenge.category}</Badge>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">Join Challenge</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Challenge Participation
                </CardTitle>
                <CardDescription>Live-style participation metrics using mock data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Participation rate", value: 84, progress: 84 },
                  { label: "On-time completions", value: 68, progress: 68 },
                  { label: "Average XP per challenge", value: 142, progress: 57 },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{metric.label}</span>
                      <span className="font-semibold tabular-nums">{metric.value}{metric.label.includes("XP") ? " XP" : "%"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-orange-500" />
                  Rewards Preview
                </CardTitle>
                <CardDescription>Mock rewards you can surface in the gamification experience.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {mockRewardCards.map((reward) => (
                  <div key={reward.id} className="rounded-xl border border-muted-foreground/20 bg-muted/20 p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{reward.icon}</span>
                        <p className="font-semibold">{reward.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{reward.cost} XP</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "participation" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Challenge Participation
            </CardTitle>
            <CardDescription>
              Static engagement overview for the challenge system.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Active participants", value: 128, detail: "across 3 live challenges" },
              { label: "Completion rate", value: "72%", detail: "last 30 days" },
              { label: "Average XP gained", value: "146", detail: "per completed challenge" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{item.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "badges" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" />
              Badge Gallery
            </CardTitle>
            <CardDescription>Badge inventory generated from mock data only.</CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeGrid userTotalPoints={myTotalPoints} isReadOnly />
          </CardContent>
        </Card>
      )}

      {activeTab === "rewards" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-500" />
              Rewards
            </CardTitle>
            <CardDescription>Preview rewards that can be redeemed with XP.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {mockRewardCards.map((reward) => (
              <div key={reward.id} className="rounded-2xl border bg-card p-4">
                <p className="text-lg">{reward.icon}</p>
                <p className="mt-3 font-semibold">{reward.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline">{reward.cost} XP</Badge>
                  <Button size="sm" variant="outline">Redeem</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "leaderboard" && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Leaderboard
              </CardTitle>
              <CardDescription>Mock ranking based on challenge XP.</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable period="all-time" limit={5} entries={mockLeaderboardEntries} isLoading={false} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                My Points
              </CardTitle>
              <CardDescription>Points history preview for the current demo user.</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.id ? <PointsHistoryList userId={user.id} /> : <p className="text-sm text-muted-foreground">No user session found.</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
