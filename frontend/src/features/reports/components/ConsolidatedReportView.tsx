import React from "react";
import { ConsolidatedReport } from "../api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { Avatar, AvatarFallback } from "../../../shared/components/ui/avatar";
import { Leaf, Users, ShieldCheck, Trophy, Target, TrendingUp } from "lucide-react";

export function ConsolidatedReportView({ report }: { report: ConsolidatedReport }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-primary/20 bg-primary/5 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Overall ESG Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">{report.overall_esg_score}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4 text-environmental" /> Environmental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-environmental">{report.environmental_score}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-social" style={{ color: "hsl(var(--social))" }} /> Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-social" style={{ color: "hsl(var(--social))" }}>{report.social_score}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-governance" style={{ color: "hsl(var(--governance))" }} /> Governance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-governance" style={{ color: "hsl(var(--governance))" }}>{report.governance_score}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>ESG Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-8 py-4 h-full">
            <div className="flex gap-4">
              <ScoreGauge score={report.environmental_score} maxScore={100} label="Env" size="sm" />
              <ScoreGauge score={report.social_score} maxScore={100} label="Soc" size="sm" />
              <ScoreGauge score={report.governance_score} maxScore={100} label="Gov" size="sm" />
            </div>
            <div className="text-center text-sm text-muted-foreground max-w-[200px]">
              Individual pillar performance contributing to the aggregate score.
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              ESG Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.trend_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-social" style={{ color: "hsl(var(--social))" }} />
              Top CSR Initiatives
            </CardTitle>
            <CardDescription>Highest impact initiatives this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.top_initiatives.map((init, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 border border-border/50 rounded-xl bg-card/40 hover:bg-card/80 transition-colors">
                  <div>
                    <h4 className="font-semibold text-foreground leading-tight">{init.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{init.impact}</p>
                  </div>
                </div>
              ))}
              {report.top_initiatives.length === 0 && (
                <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/20">
                  No initiatives found this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Top ESG Contributors
            </CardTitle>
            <CardDescription>Employees driving the most impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.top_contributors.map((contributor, idx) => {
                const initials = contributor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-border/50 rounded-xl bg-card/40 hover:bg-card/80 transition-colors">
                    <div className="w-8 flex justify-center text-sm font-bold text-muted-foreground">
                      #{idx + 1}
                    </div>
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{contributor.name}</p>
                    </div>
                    <div className="text-sm font-bold tabular-nums pr-2">
                      {contributor.points.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">pts</span>
                    </div>
                  </div>
                );
              })}
              {report.top_contributors.length === 0 && (
                <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/20">
                  No contributors found this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
