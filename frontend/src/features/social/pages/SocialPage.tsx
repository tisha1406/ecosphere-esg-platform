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
} from "../../../shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { useAuth } from "../../../app/providers/AuthProvider";
import { WellbeingSurveyForm } from "../components/WellbeingSurveyForm";
import { CsrInitiativeForm } from "../components/CsrInitiativeForm";
import { DiversityMetricForm } from "../components/DiversityMetricForm";
import { CsrInitiativeList } from "../components/CsrInitiativeList";
import { DiversityDashboardTab } from "../components/DiversityDashboardTab";
import { WellbeingTrendChart } from "../components/WellbeingTrendChart";
import { SocialScoreStrip } from "../components/SocialScoreStrip";
import { WellbeingTable } from "../components/WellbeingTable";
import { DiversityTable } from "../components/DiversityTable";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Plus, Heart, Users, HeartHandshake, FileBadge, ClipboardCheck } from "lucide-react";

const writeRoles = ["admin", "esg_manager", "social_officer"];

export function SocialPage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !writeRoles.includes(user.role);

  const [activeTab, setActiveTab] = useState("csr");
  const [wellbeingOpen, setWellbeingOpen] = useState(false);
  const [csrOpen, setCsrOpen] = useState(false);
  const [diversityOpen, setDiversityOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Social Module" 
        description="Manage CSR initiatives, employee wellbeing, and diversity metrics."
      >
        {!isReadOnly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-social hover:bg-social/90 text-social-foreground shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Add Record
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card">
              <DropdownMenuItem onClick={() => setCsrOpen(true)} className="cursor-pointer">
                <HeartHandshake className="mr-2 h-4 w-4 text-muted-foreground" /> CSR Initiative
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWellbeingOpen(true)} className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4 text-muted-foreground" /> Wellbeing Survey
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDiversityOpen(true)} className="cursor-pointer">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Diversity Metric
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </PageHeader>

      <SocialScoreStrip />

      {/* Dialogs */}
      {!isReadOnly && (
        <>
          <Dialog open={wellbeingOpen} onOpenChange={setWellbeingOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Wellbeing Survey</DialogTitle>
              </DialogHeader>
              <WellbeingSurveyForm onSuccess={() => setWellbeingOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={csrOpen} onOpenChange={setCsrOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New CSR Initiative</DialogTitle>
              </DialogHeader>
              <CsrInitiativeForm onSuccess={() => setCsrOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={diversityOpen} onOpenChange={setDiversityOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Diversity Metric</DialogTitle>
              </DialogHeader>
              <DiversityMetricForm onSuccess={() => setDiversityOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="csr" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 flex-wrap h-auto justify-start">
          <TabsTrigger value="csr">CSR Activities</TabsTrigger>
          <TabsTrigger value="participation">Employee Participation</TabsTrigger>
          <TabsTrigger value="diversity">Diversity Dashboard</TabsTrigger>
          <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
          <TabsTrigger value="volunteering">Volunteer Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="csr" className="space-y-4 focus-visible:outline-none">
          <CsrInitiativeList isReadOnly={isReadOnly} />
        </TabsContent>

        <TabsContent value="participation" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Employee Participation Coming Soon"
                description="We're building a dedicated queue and approval system for employee participation in CSR activities. This feature requires pending backend endpoint support."
                icon={<ClipboardCheck className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4 focus-visible:outline-none">
          <DiversityDashboardTab />
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle>Diversity Records</CardTitle>
              <CardDescription>Historical diversity metrics by department and period.</CardDescription>
            </CardHeader>
            <CardContent>
              <DiversityTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellbeing" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2">
            <WellbeingTrendChart />
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                <Heart className="w-16 h-16 text-social mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Employee Wellbeing</h3>
                <p className="text-muted-foreground">
                  Track and measure employee satisfaction over time. Consistent check-ins help identify burnout risks and promote a healthier workplace culture.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Survey Records</CardTitle>
              <CardDescription>All employee wellbeing survey submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <WellbeingTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteering" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Volunteer Programs Coming Soon"
                description="A dedicated module for tracking individual volunteer hours and external programs is currently in development. It will require a distinct backend endpoint."
                icon={<FileBadge className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
