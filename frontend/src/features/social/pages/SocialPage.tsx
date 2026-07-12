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
import { useAuth } from "../../../app/providers/AuthProvider";
import { WellbeingSurveyForm } from "../components/WellbeingSurveyForm";
import { CsrInitiativeForm } from "../components/CsrInitiativeForm";
import { DiversityMetricForm } from "../components/DiversityMetricForm";
import { CsrInitiativeList } from "../components/CsrInitiativeList";
import { DiversityChart } from "../components/DiversityChart";
import { WellbeingTrendChart } from "../components/WellbeingTrendChart";
import { SocialScoreCard } from "../components/SocialScoreCard";
import { DataTable } from "../../../shared/components/DataTable";
import { useWellbeingQuery, useDeleteWellbeingMutation, useDeleteDiversityMutation, useDiversityQuery } from "../hooks";
import { Badge } from "../../../shared/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

const writeRoles = ["admin", "esg_manager", "social_officer"];

export function SocialPage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !writeRoles.includes(user.role);

  const [activeTab, setActiveTab] = useState("score");
  const [wellbeingOpen, setWellbeingOpen] = useState(false);
  const [csrOpen, setCsrOpen] = useState(false);
  const [diversityOpen, setDiversityOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Social Module
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Wellbeing surveys, CSR initiatives, and diversity metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isReadOnly && activeTab === "wellbeing" && (
            <Dialog open={wellbeingOpen} onOpenChange={setWellbeingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Survey
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Wellbeing Survey</DialogTitle>
                </DialogHeader>
                <WellbeingSurveyForm onSuccess={() => setWellbeingOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {!isReadOnly && activeTab === "csr" && (
            <Dialog open={csrOpen} onOpenChange={setCsrOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Initiative
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>New CSR Initiative</DialogTitle>
                </DialogHeader>
                <CsrInitiativeForm onSuccess={() => setCsrOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {!isReadOnly && activeTab === "diversity" && (
            <Dialog open={diversityOpen} onOpenChange={setDiversityOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Metric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Diversity Metric</DialogTitle>
                </DialogHeader>
                <DiversityMetricForm onSuccess={() => setDiversityOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="score" className="space-y-4">
        <TabsList className="bg-blue-50 dark:bg-blue-950/30">
          <TabsTrigger
            value="score"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Score Overview
          </TabsTrigger>
          <TabsTrigger
            value="wellbeing"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Wellbeing
          </TabsTrigger>
          <TabsTrigger
            value="csr"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            CSR Initiatives
          </TabsTrigger>
          <TabsTrigger
            value="diversity"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Diversity
          </TabsTrigger>
        </TabsList>

        {/* Score Tab */}
        <TabsContent value="score" className="space-y-4">
          <SocialScoreCard />
        </TabsContent>

        {/* Wellbeing Tab */}
        <TabsContent value="wellbeing" className="space-y-4">
          <WellbeingTrendChart />
          <WellbeingTable isReadOnly={isReadOnly} />
        </TabsContent>

        {/* CSR Tab */}
        <TabsContent value="csr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CSR Initiatives</CardTitle>
              <CardDescription>
                Track community and social responsibility programs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CsrInitiativeList isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diversity Tab */}
        <TabsContent value="diversity" className="space-y-4">
          <DiversityChart />
          <DiversityTable isReadOnly={isReadOnly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Inline sub-tables ──────────────────────────────────────────────────────────

function WellbeingTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWellbeingQuery({ page, page_size: 10 });
  const deleteMutation = useDeleteWellbeingMutation();
  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Employee ID", accessor: (row: any) => row.employee_id.slice(0, 8) + "…" },
    { header: "Date", accessor: "survey_date" as const },
    {
      header: "Score",
      accessor: (row: any) => (
        <Badge
          variant={row.satisfaction_score >= 7 ? "default" : row.satisfaction_score >= 4 ? "secondary" : "outline"}
        >
          {row.satisfaction_score} / 10
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) =>
        !isReadOnly ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Records</CardTitle>
        <CardDescription>All employee wellbeing survey submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={items}
          totalItems={total}
          currentPage={page}
          pageSize={10}
          onPageChange={setPage}
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

function DiversityTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDiversityQuery({ page, page_size: 10 });
  const deleteMutation = useDeleteDiversityMutation();
  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Period", accessor: "period" as const },
    { header: "Dept ID", accessor: (row: any) => row.department_id.slice(0, 8) + "…" },
    {
      header: "Gender Ratio",
      accessor: (row: any) => `${Math.round(row.gender_ratio * 100)}%`,
    },
    {
      header: "Inclusion Score",
      accessor: (row: any) => (
        <Badge variant={row.inclusion_score >= 70 ? "default" : "secondary"}>
          {row.inclusion_score.toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) =>
        !isReadOnly ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diversity Records</CardTitle>
        <CardDescription>Historical diversity metrics by department and period.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={items}
          totalItems={total}
          currentPage={page}
          pageSize={10}
          onPageChange={setPage}
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
