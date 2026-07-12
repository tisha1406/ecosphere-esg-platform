import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { GovernanceScoreCard } from "../components/GovernanceScoreCard";
import { PoliciesTable } from "../components/PoliciesTable";
import { AuditsTable } from "../components/AuditsTable";
import { BoardActivityFeed } from "../components/BoardActivityFeed";
import { PolicyForm } from "../components/PolicyForm";
import { AuditForm } from "../components/AuditForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../shared/components/ui/dialog";
import { Plus } from "lucide-react";

export function GovernancePage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !["admin", "esg_manager", "governance_officer"].includes(user.role);
  
  const [activeTab, setActiveTab] = useState("score");
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-governance" style={{ color: "hsl(var(--governance))" }}>Governance Module</h2>
        <div className="flex items-center space-x-2">
          {!isReadOnly && activeTab === "policies" && (
            <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-governance hover:bg-governance/90" style={{ backgroundColor: "hsl(var(--governance))" }}><Plus className="mr-2 h-4 w-4" /> Add Policy</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Governance Policy</DialogTitle></DialogHeader>
                <PolicyForm onSuccess={() => setIsPolicyOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {!isReadOnly && activeTab === "audits" && (
            <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
              <DialogTrigger asChild>
                <Button className="bg-governance hover:bg-governance/90" style={{ backgroundColor: "hsl(var(--governance))" }}><Plus className="mr-2 h-4 w-4" /> Add Audit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Compliance Audit</DialogTitle></DialogHeader>
                <AuditForm onSuccess={() => setIsAuditOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="score" className="space-y-4">
        <TabsList>
          <TabsTrigger value="score">Score Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audits">Compliance Audits</TabsTrigger>
          <TabsTrigger value="board">Board Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="score" className="space-y-4">
          <GovernanceScoreCard />
        </TabsContent>
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Company Policies</CardTitle><CardDescription>Manage your corporate governance policies.</CardDescription></CardHeader>
            <CardContent><PoliciesTable isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Compliance Audits</CardTitle><CardDescription>Track compliance audit scores and findings.</CardDescription></CardHeader>
            <CardContent><AuditsTable isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="board" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Board Activity Feed</CardTitle><CardDescription>Timeline of board meetings and decisions.</CardDescription></CardHeader>
            <CardContent><BoardActivityFeed isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
