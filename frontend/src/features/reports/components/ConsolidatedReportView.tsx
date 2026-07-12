import React from "react";
import { ConsolidatedReport } from "../api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { ScoreGauge } from "../../../shared/components/ScoreGauge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DataTable } from "../../../shared/components/DataTable";

export function ConsolidatedReportView({ report }: { report: ConsolidatedReport }) {
  const contributorColumns = [
    { header: "Name", accessor: "name" as const },
    { header: "Points", accessor: "points" as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall ESG Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{report.overall_esg_score}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Environmental</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-environmental">{report.environmental_score}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Social</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-social" style={{ color: "hsl(var(--social))" }}>{report.social_score}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Governance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-governance" style={{ color: "hsl(var(--governance))" }}>{report.governance_score}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ESG Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4 py-8">
            <ScoreGauge score={report.environmental_score} maxScore={100} label="Env" size="sm" />
            <ScoreGauge score={report.social_score} maxScore={100} label="Soc" size="sm" />
            <ScoreGauge score={report.governance_score} maxScore={100} label="Gov" size="sm" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ESG Score Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.trend_series}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top CSR Initiatives</CardTitle>
            <CardDescription>Highest impact initiatives this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.top_initiatives.map((init, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                  <div>
                    <h4 className="font-semibold">{init.name}</h4>
                    <p className="text-sm text-muted-foreground">{init.impact}</p>
                  </div>
                </div>
              ))}
              {report.top_initiatives.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">No initiatives found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top ESG Contributors</CardTitle>
            <CardDescription>Employees driving the most impact</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={contributorColumns} 
              data={report.top_contributors} 
              totalItems={report.top_contributors.length}
              currentPage={1}
              pageSize={10}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
