import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { CustomReportBuilder } from "../components/CustomReportBuilder";
import { ConsolidatedReportView } from "../components/ConsolidatedReportView";
import { ReportCard } from "../components/ReportCard";
import { useConsolidatedReportQuery } from "../hooks";
import { PageHeader } from "../../../shared/components/PageHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Leaf, Users, ShieldCheck, History, Settings2, BarChart3, Loader2, AlertCircle } from "lucide-react";

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("summary");

  // Fetch the summary report automatically for the Summary tab
  const defaultCompanyId = "default";
  const defaultPeriod = "2026-FY";
  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useConsolidatedReportQuery(defaultCompanyId, defaultPeriod);
  
  const report = summaryData?.data;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Reports & Analytics" 
        description="Generate, preview, and export consolidated ESG reports and pillar-specific metrics."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="summary" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 flex-wrap h-auto justify-start">
          <TabsTrigger value="summary">ESG Summary</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="builder">Custom Builder</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 focus-visible:outline-none">
          {isSummaryLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground glass-card">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading ESG Summary...</p>
            </div>
          )}
          {isSummaryError && (
             <div className="flex flex-col items-center justify-center py-20 text-destructive glass-card border-destructive/20 bg-destructive/5">
               <AlertCircle className="w-10 h-10 mb-4" />
               <p>Failed to load the summary report.</p>
             </div>
          )}
          {report && (
            <ConsolidatedReportView report={report} />
          )}
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Emissions Overview" 
              description="Detailed breakdown of Scope 1, 2, and 3 carbon emissions." 
              icon={<Leaf className="w-6 h-6 text-environmental" />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-environmental"
            />
            <ReportCard 
              title="Energy Consumption" 
              description="Analysis of energy usage split by renewable vs non-renewable sources." 
              icon={<Leaf className="w-6 h-6 text-environmental" />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-environmental"
            />
            <ReportCard 
              title="Waste & Recycling" 
              description="Track total waste generated and diversion rates." 
              icon={<Leaf className="w-6 h-6 text-environmental" />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-environmental"
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Diversity & Inclusion" 
              description="Metrics covering demographic breakdowns and pay equity." 
              icon={<Users className="w-6 h-6 text-social" style={{ color: "hsl(var(--social))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-social"
            />
            <ReportCard 
              title="Employee Wellbeing" 
              description="Survey results, satisfaction scores, and retention rates." 
              icon={<Users className="w-6 h-6 text-social" style={{ color: "hsl(var(--social))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-social"
            />
            <ReportCard 
              title="CSR Initiatives" 
              description="Summary of corporate social responsibility activities and community impact." 
              icon={<Users className="w-6 h-6 text-social" style={{ color: "hsl(var(--social))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-social"
            />
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Policy Compliance" 
              description="Acknowledgement rates and adherence to corporate policies." 
              icon={<ShieldCheck className="w-6 h-6 text-governance" style={{ color: "hsl(var(--governance))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-governance"
            />
            <ReportCard 
              title="Audit Trails" 
              description="Records of internal and external compliance audits." 
              icon={<ShieldCheck className="w-6 h-6 text-governance" style={{ color: "hsl(var(--governance))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-governance"
            />
            <ReportCard 
              title="Board Demographics" 
              description="Composition and meeting activity of the governing board." 
              icon={<ShieldCheck className="w-6 h-6 text-governance" style={{ color: "hsl(var(--governance))" }} />} 
              companyId={defaultCompanyId}
              period={defaultPeriod}
              themeClass="text-governance"
            />
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <CustomReportBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 focus-visible:outline-none">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <EmptyState 
                title="Report History Coming Soon"
                description="We're currently developing a centralized archive where you can access previously generated and scheduled reports. This feature requires pending backend API support."
                icon={<History className="w-12 h-12 text-muted-foreground opacity-50" />}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
