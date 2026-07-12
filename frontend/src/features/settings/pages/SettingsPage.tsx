import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { useAuth } from "../../../app/providers/AuthProvider";
import { EsgConfigTab } from "../components/EsgConfigTab";
import { NotificationsTab } from "../components/NotificationsTab";
import { ThemeTab } from "../components/ThemeTab";
import { PermissionsTab } from "../components/PermissionsTab";
import { SettingsEmptyState } from "../components/SettingsEmptyState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { DepartmentsTab } from "../components/DepartmentsTab";
import { CategoriesTab } from "../components/CategoriesTab";
import { UserManagementTab } from "../components/UserManagementTab";

export function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("config");

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Settings" 
        description="Manage system configurations, user access, and your preferences."
      />

      <div className="glass-card rounded-2xl border border-border/50 bg-card/50 shadow-sm p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="config" className="flex flex-col md:flex-row gap-6">
          <TabsList className="flex md:flex-col h-auto w-full md:w-64 bg-transparent p-0 justify-start space-x-2 md:space-x-0 space-y-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            <TabsTrigger 
              value="config" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              ESG Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="departments" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Categories
            </TabsTrigger>
            
            {isAdmin && (
              <TabsTrigger 
                value="users" 
                className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
              >
                User Management
              </TabsTrigger>
            )}

            <TabsTrigger 
              value="permissions" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="theme" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="audits" 
              className="justify-start px-4 py-2.5 text-left rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-colors border border-transparent"
            >
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="config" className="mt-0 outline-none">
              <EsgConfigTab />
            </TabsContent>

            <TabsContent value="departments" className="mt-0 outline-none">
              <DepartmentsTab />
            </TabsContent>

            <TabsContent value="categories" className="mt-0 outline-none">
              <CategoriesTab />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="users" className="mt-0 outline-none">
                <UserManagementTab />
              </TabsContent>
            )}

            <TabsContent value="permissions" className="mt-0 outline-none">
              <PermissionsTab />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 outline-none">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="theme" className="mt-0 outline-none">
              <ThemeTab />
            </TabsContent>

            <TabsContent value="audits" className="mt-0 outline-none">
              <SettingsEmptyState
                title="System Audit Logs"
                description="Audit logging for system activities (logins, role changes, configuration updates) is pending backend support."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
