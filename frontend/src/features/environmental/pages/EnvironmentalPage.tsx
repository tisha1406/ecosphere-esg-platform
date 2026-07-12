import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { EnvironmentalScoreCard } from "../components/EnvironmentalScoreCard";
import { EmissionsTable } from "../components/EmissionsTable";
import { EnergyTable } from "../components/EnergyTable";
import { WasteTable } from "../components/WasteTable";
import { EmissionForm } from "../components/EmissionForm";
import { EnergyForm } from "../components/EnergyForm";
import { WasteForm } from "../components/WasteForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../shared/components/ui/dialog";
import { Plus } from "lucide-react";

export function EnvironmentalPage() {
  const { user } = useAuth();
  const isReadOnly = !user?.role || !["admin", "esg_manager", "governance_officer"].includes(user.role);
  
  const [activeTab, setActiveTab] = useState("score");
  const [isEmissionOpen, setIsEmissionOpen] = useState(false);
  const [isEnergyOpen, setIsEnergyOpen] = useState(false);
  const [isWasteOpen, setIsWasteOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-environmental">Environmental Module</h2>
        <div className="flex items-center space-x-2">
          {!isReadOnly && activeTab === "emissions" && (
            <Dialog open={isEmissionOpen} onOpenChange={setIsEmissionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-environmental hover:bg-environmental/90"><Plus className="mr-2 h-4 w-4" /> Add Emission</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Carbon Emission</DialogTitle></DialogHeader>
                <EmissionForm onSuccess={() => setIsEmissionOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {!isReadOnly && activeTab === "energy" && (
            <Dialog open={isEnergyOpen} onOpenChange={setIsEnergyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-environmental hover:bg-environmental/90"><Plus className="mr-2 h-4 w-4" /> Add Energy</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Energy Usage</DialogTitle></DialogHeader>
                <EnergyForm onSuccess={() => setIsEnergyOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {!isReadOnly && activeTab === "waste" && (
            <Dialog open={isWasteOpen} onOpenChange={setIsWasteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-environmental hover:bg-environmental/90"><Plus className="mr-2 h-4 w-4" /> Add Waste</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Waste Tracking</DialogTitle></DialogHeader>
                <WasteForm onSuccess={() => setIsWasteOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="score" className="space-y-4">
        <TabsList>
          <TabsTrigger value="score">Score Overview</TabsTrigger>
          <TabsTrigger value="emissions">Carbon Emissions</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
          <TabsTrigger value="waste">Waste Tracking</TabsTrigger>
        </TabsList>
        <TabsContent value="score" className="space-y-4">
          <EnvironmentalScoreCard />
        </TabsContent>
        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Carbon Emissions</CardTitle><CardDescription>Manage your scope 1, 2, and 3 emissions.</CardDescription></CardHeader>
            <CardContent><EmissionsTable isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Energy Usage</CardTitle><CardDescription>Track electricity, gas, and renewable energy consumption.</CardDescription></CardHeader>
            <CardContent><EnergyTable isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Waste Tracking</CardTitle><CardDescription>Monitor recycled, landfill, composted, and hazardous waste.</CardDescription></CardHeader>
            <CardContent><WasteTable isReadOnly={isReadOnly} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
