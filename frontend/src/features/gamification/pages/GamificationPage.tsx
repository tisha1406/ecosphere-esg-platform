import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { useAuth } from "../../../app/providers/AuthProvider";
import { LeaderboardTable } from "../components/LeaderboardTable";
import { BadgeGrid } from "../components/BadgeGrid";
import { PointsHistoryList } from "../components/PointsHistoryList";
import { useCreateBadgeMutation, useUserPointsQuery, useAwardPointsMutation } from "../hooks";
import { badgeSchema, BadgeFormValues, awardPointsSchema, AwardPointsValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trophy, Star, Zap } from "lucide-react";

const adminRoles = ["admin"];
const writeRoles = ["admin", "esg_manager"];

export function GamificationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canWrite = user?.role && writeRoles.includes(user.role);

  const [activeTab, setActiveTab] = useState("leaderboard");
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [awardOpen, setAwardOpen] = useState(false);

  // Fetch current user's points for BadgeGrid progress bars
  const { data: myPointsData } = useUserPointsQuery(user?.id || "");
  const myTotalPoints = myPointsData?.data?.total_points || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Gamification
              </h2>
              <p className="text-muted-foreground text-sm">
                Earn points, unlock badges, and compete on the leaderboard
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canWrite && activeTab === "badges" && (
            <Dialog open={badgeOpen} onOpenChange={setBadgeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  New Badge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Badge</DialogTitle>
                </DialogHeader>
                <BadgeCreateForm onSuccess={() => setBadgeOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {isAdmin && (
            <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  Award Points
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Award Points (Admin)</DialogTitle>
                </DialogHeader>
                <AwardPointsForm onSuccess={() => setAwardOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
            My Points
          </p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 tabular-nums">
            {myTotalPoints.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
            Current User
          </p>
          <p className="text-sm font-bold truncate">{user?.full_name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace(/_/g, " ")}</p>
        </div>
        <div className="rounded-xl border bg-gradient-to-br from-environmental/5 to-environmental/10 border-environmental/20 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
            Platform
          </p>
          <p className="text-sm font-bold">EcoSphere ESG</p>
          <p className="text-xs text-muted-foreground">Points refresh every 60s</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="leaderboard" className="gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="my-points" className="gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            My Points
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                All-Time Leaderboard
              </CardTitle>
              <CardDescription>
                Rankings based on cumulative ESG activity points. Auto-refreshes every 60 seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable period="all-time" limit={20} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Achievement Badges
              </CardTitle>
              <CardDescription>
                Badges unlock automatically when you reach the required points threshold.
                {myTotalPoints > 0 && (
                  <span className="ml-1 font-medium text-foreground">
                    You have {myTotalPoints.toLocaleString()} points.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeGrid
                userTotalPoints={myTotalPoints}
                isReadOnly={!canWrite}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Points Tab */}
        <TabsContent value="my-points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Points History
              </CardTitle>
              <CardDescription>
                Your complete chronological record of earned points across all ESG activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.id ? (
                <PointsHistoryList userId={user.id} />
              ) : (
                <p className="text-sm text-muted-foreground">No user session found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Badge Create Form (inline) ─────────────────────────────────────────────────

function BadgeCreateForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useCreateBadgeMutation();

  const form = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      name: "",
      criteria: "",
      icon: "star.png",
      points_value: 100,
    },
  });

  const onSubmit = async (data: BadgeFormValues) => {
    await mutation.mutateAsync(data);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Badge Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Carbon Champion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="criteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Earn 500 points from emissions tracking" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input placeholder="star.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="points_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Required</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating…" : "Create Badge"}
        </Button>
      </form>
    </Form>
  );
}

// ── Award Points Form (admin only) ──────────────────────────────────────────────

function AwardPointsForm({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useAwardPointsMutation();

  const form = useForm<AwardPointsValues>({
    resolver: zodResolver(awardPointsSchema),
    defaultValues: {
      user_id: "",
      points: 10,
      reason: "",
    },
  });

  const onSubmit = async (data: AwardPointsValues) => {
    await mutation.mutateAsync(data);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder="UUID of the user" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points (use negative to deduct)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Manual bonus for Q1 report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Awarding…" : "Award Points"}
        </Button>
      </form>
    </Form>
  );
}
