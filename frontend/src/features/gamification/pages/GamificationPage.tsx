import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { LeaderboardTable } from "../components/LeaderboardTable";
import { BadgeGrid } from "../components/BadgeGrid";
import { MyPointsTab } from "../components/MyPointsTab";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { useUserPointsQuery } from "../hooks";
import { Trophy, Star, Target, Gift, Zap } from "lucide-react";

export function GamificationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("leaderboard");

  const { data: myPointsData } = useUserPointsQuery(user?.id || "");
  const myTotalPoints = myPointsData?.data?.total_points || 0;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Gamification" 
        description="Track your ESG achievements, earn badges, and climb the leaderboard."
      >
        <Button variant="outline" className="glass-card shadow-sm">
          <Zap className="mr-2 h-4 w-4 text-orange-500" />
          My Score: <strong className="ml-1 text-orange-500">{myTotalPoints.toLocaleString()}</strong>
        </Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="leaderboard" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 flex-wrap h-auto justify-start">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="mypoints">My Points</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <LeaderboardTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="ESG Challenges Coming Soon"
                description="We're currently developing a robust Challenge engine where you can participate in corporate sustainability initiatives to earn extra XP and limited-edition badges. This feature requires pending backend API support."
                icon={<Target className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 focus-visible:outline-none">
          <BadgeGrid userTotalPoints={myTotalPoints} isReadOnly={true} />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Rewards Store Coming Soon"
                description="A dedicated module for exchanging your hard-earned XP for company perks, merchandise, and donation-matching is currently in development. It will require a distinct backend endpoint."
                icon={<Gift className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mypoints" className="space-y-4 focus-visible:outline-none">
          <MyPointsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
