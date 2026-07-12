import React, { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/ui/table";
import { mockDepartments, mockCategoryPills, mockConfigRows } from "../mock";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("departments");

  return (
    <div className="flex-1 space-y-5 p-6 md:p-8 pt-6 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Configuration and administration mocked for demo mode.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Department
          </Button>
          <Button variant="secondary" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} defaultValue="departments" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2 bg-transparent p-0 h-auto w-full">
          <TabsTrigger value="departments" className="justify-start border border-muted-foreground/20 bg-muted/60 data-[state=active]:bg-muted data-[state=active]:text-foreground">
            Departments
          </TabsTrigger>
          <TabsTrigger value="categories" className="justify-start border border-muted-foreground/20 bg-muted/60 data-[state=active]:bg-muted data-[state=active]:text-foreground">
            Categories
          </TabsTrigger>
          <TabsTrigger value="config" className="justify-start border border-muted-foreground/20 bg-muted/60 data-[state=active]:bg-muted data-[state=active]:text-foreground">
            ESG Configuration
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start border border-muted-foreground/20 bg-muted/60 data-[state=active]:bg-muted data-[state=active]:text-foreground">
            Notification Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Static department directory for the admin demo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Parent Dept</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDepartments.map((dept) => (
                    <TableRow key={dept.code}>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>{dept.head}</TableCell>
                      <TableCell>{dept.parentDept}</TableCell>
                      <TableCell>{dept.employees}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-500/40 text-green-400">{dept.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>High-level operational categories shown as static pills.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mockCategoryPills.map((item) => (
                <Badge key={item} variant="secondary" className="px-4 py-1.5">{item}</Badge>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>ESG Configuration</CardTitle>
              <CardDescription>Mocked platform switches to mirror the admin UI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockConfigRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl border border-muted-foreground/20 bg-muted/20 p-4">
                  <span className="text-sm font-medium">{row.label}</span>
                  {row.enabled ? <ToggleRight className="h-8 w-8 text-green-500" /> : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Static notification preferences for the demo environment.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Compliance alerts", description: "Send immediate email alerts for compliance issues." },
                { title: "Weekly summaries", description: "Bundle module activity into a weekly summary." },
                { title: "Challenge reminders", description: "Notify users before challenge deadlines." },
                { title: "Badge unlocks", description: "Celebrate badge unlocks with toast notifications." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-muted-foreground/20 bg-muted/20 p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
