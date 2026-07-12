import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { EnvironmentalScoreTab } from "../components/EnvironmentalScoreTab";
import { EnvironmentalDashboardTab } from "../components/EnvironmentalDashboardTab";
import { EmissionsTable } from "../components/EmissionsTable";
import { EnergyTable } from "../components/EnergyTable";
import { WasteTable } from "../components/WasteTable";
import { EmissionForm } from "../components/EmissionForm";
import { EnergyForm } from "../components/EnergyForm";
import { WasteForm } from "../components/WasteForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../shared/components/ui/dropdown-menu";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Plus, Target, Cloud, Zap, Recycle } from "lucide-react";

export function EnvironmentalPage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !["admin", "esg_manager", "governance_officer"].includes(user.role);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEmissionOpen, setIsEmissionOpen] = useState(false);
  const [isEnergyOpen, setIsEnergyOpen] = useState(false);
  const [isWasteOpen, setIsWasteOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Environmental Module" 
        description="Monitor, track, and manage your organization's environmental impact."
      >
        {!isReadOnly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-environmental hover:bg-environmental/90 text-environmental-foreground shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Add Record
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card">
              <DropdownMenuItem onClick={() => setIsEmissionOpen(true)} className="cursor-pointer">
                <Cloud className="mr-2 h-4 w-4 text-muted-foreground" /> Carbon Emission
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEnergyOpen(true)} className="cursor-pointer">
                <Zap className="mr-2 h-4 w-4 text-muted-foreground" /> Energy Usage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsWasteOpen(true)} className="cursor-pointer">
                <Recycle className="mr-2 h-4 w-4 text-muted-foreground" /> Waste Tracking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </PageHeader>

      {/* Forms Dialogs */}
      {!isReadOnly && (
        <>
          <Dialog open={isEmissionOpen} onOpenChange={setIsEmissionOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Add Carbon Emission</DialogTitle></DialogHeader>
              <EmissionForm onSuccess={() => setIsEmissionOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEnergyOpen} onOpenChange={setIsEnergyOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Add Energy Usage</DialogTitle></DialogHeader>
              <EnergyForm onSuccess={() => setIsEnergyOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isWasteOpen} onOpenChange={setIsWasteOpen}>
            <DialogContent className="glass-card sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Add Waste Tracking</DialogTitle></DialogHeader>
              <WasteForm onSuccess={() => setIsWasteOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="emissions">Carbon Emissions</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
          <TabsTrigger value="waste">Waste Tracking</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="score">Env Score</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <EnvironmentalDashboardTab />
        </TabsContent>

        <TabsContent value="emissions" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Carbon Emissions Data</CardTitle>
              <CardDescription>Detailed log of scope 1, 2, and 3 emissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmissionsTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Energy Usage Data</CardTitle>
              <CardDescription>Comprehensive tracking of electricity, gas, and renewables.</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Waste Tracking Data</CardTitle>
              <CardDescription>Log and monitor recycled, composted, and landfill waste.</CardDescription>
            </CardHeader>
            <CardContent>
              <WasteTable isReadOnly={isReadOnly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="No Environmental Goals Configured"
                description="Your organization hasn't set up specific environmental targets yet. Configure goals in the Settings module to track progress over time."
                icon={<Target className="w-12 h-12 text-muted-foreground opacity-50" />}
                action={
                  <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                    Configure Goals in Settings
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="score" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
          <EnvironmentalScoreTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
