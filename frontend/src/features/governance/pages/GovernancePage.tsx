import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../shared/components/ui/dropdown-menu";
import { useAuth } from "../../../app/providers/AuthProvider";
import { GovernanceScoreStrip } from "../components/GovernanceScoreStrip";
import { PoliciesList } from "../components/PoliciesList";
import { AuditsTable } from "../components/AuditsTable";
import { AuditTimeline } from "../components/AuditTimeline";
import { BoardActivityFeed } from "../components/BoardActivityFeed";
import { PolicyForm } from "../components/PolicyForm";
import { AuditForm } from "../components/AuditForm";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Plus, ShieldCheck, ClipboardCheck, AlertTriangle, Users, FileSignature } from "lucide-react";

const writeRoles = ["admin", "esg_manager", "governance_officer"];

export function GovernancePage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !writeRoles.includes(user.role);
  
  const [activeTab, setActiveTab] = useState("policies");
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Governance Module" 
        description="Manage corporate policies, compliance audits, and board activities."
      >
        {!isReadOnly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-governance hover:bg-governance/90 text-governance-foreground shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Add Record
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card">
              <DropdownMenuItem onClick={() => setIsPolicyOpen(true)} className="cursor-pointer">
                <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Governance Policy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAuditOpen(true)} className="cursor-pointer">
                <ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Compliance Audit
              </DropdownMenuItem>
              {/* Note: Board Activity creation is handled via an inline form or separate dialog if needed in the future, for now it's just these two as per original */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </PageHeader>

      <GovernanceScoreStrip />

      {/* Dialogs */}
      {!isReadOnly && (
        <>
          <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Add Governance Policy</DialogTitle></DialogHeader>
              <PolicyForm onSuccess={() => setIsPolicyOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Add Compliance Audit</DialogTitle></DialogHeader>
              <AuditForm onSuccess={() => setIsAuditOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="policies" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 flex-wrap h-auto justify-start">
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="acknowledgements">Acknowledgements</TabsTrigger>
          <TabsTrigger value="audits">Compliance Audits</TabsTrigger>
          <TabsTrigger value="issues">Compliance Issues</TabsTrigger>
          <TabsTrigger value="board">Board Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4 focus-visible:outline-none">
          <PoliciesList isReadOnly={isReadOnly} />
        </TabsContent>

        <TabsContent value="acknowledgements" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Policy Acknowledgements Coming Soon"
                description="We're building a dedicated acknowledgement tracking system to ensure all employees have read and signed mandatory policies. This feature requires pending backend endpoint support."
                icon={<FileSignature className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Audit Timeline</CardTitle>
                <CardDescription>Upcoming and recent compliance audits.</CardDescription>
              </CardHeader>
              <CardContent>
                <AuditTimeline />
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                <ClipboardCheck className="w-16 h-16 text-governance mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Compliance Audits</h3>
                <p className="text-muted-foreground">
                  Track external and internal audits to ensure alignment with ESG standards. Maintain a clean audit trail to boost your Governance Score.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Audit Records</CardTitle>
              <CardDescription>Detailed history of all compliance audits.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditsTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Compliance Issues Coming Soon"
                description="A dedicated module for logging and tracking compliance violations, risks, and remediation efforts is currently in development. It will require a distinct backend endpoint."
                icon={<AlertTriangle className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" disabled>
                    Feature in Development
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card max-w-4xl">
            <CardHeader>
              <CardTitle>Board Activity Feed</CardTitle>
              <CardDescription>Timeline of board meetings, strategic decisions, and oversight actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <BoardActivityFeed isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
