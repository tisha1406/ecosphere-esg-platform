import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../shared/components/ui/dialog";
import { ConsolidatedReportView } from "./ConsolidatedReportView";
import { useConsolidatedReportQuery, useExportReportMutation } from "../hooks";
import { FileText, Download, Eye, FileSpreadsheet, Loader2 } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  companyId: string;
  period: string;
  themeClass?: string;
  isFullReport?: boolean;
}

export function ReportCard({ title, description, icon, companyId, period, themeClass = "text-primary", isFullReport = false }: ReportCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { data, isLoading: isPreviewLoading } = useConsolidatedReportQuery(companyId, period, { enabled: isPreviewOpen });
  const exportMutation = useExportReportMutation();
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "xlsx" | null>(null);

  const handleDownload = (format: "pdf" | "xlsx") => {
    setDownloadFormat(format);
    exportMutation.mutate(
      { format, company_id: companyId, period },
      {
        onSettled: () => setDownloadFormat(null),
      }
    );
  };

  const reportData = data?.data;

  return (
    <Card className="glass-card flex flex-col h-full hover:border-border transition-colors">
      <CardHeader>
        <div className={`w-12 h-12 rounded-xl bg-card border flex items-center justify-center mb-4 ${themeClass} bg-opacity-10`}>
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50 flex items-start gap-2">
          <FileText className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            {isFullReport 
              ? "Contains aggregate data across all ESG pillars."
              : "Backend pillar filtering is not yet supported. Preview will show the full consolidated report."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 glass-card bg-background/50">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl h-[85vh] overflow-y-auto glass-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {icon}
                {title} Preview
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {isPreviewLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>Loading report data...</p>
                </div>
              ) : reportData ? (
                <ConsolidatedReportView report={reportData} />
              ) : (
                <div className="text-center py-20 text-muted-foreground">Failed to load preview.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="default" 
            className="flex-1 sm:flex-none"
            onClick={() => handleDownload("pdf")}
            disabled={exportMutation.isPending && downloadFormat === "pdf"}
          >
            {exportMutation.isPending && downloadFormat === "pdf" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            PDF
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1 sm:flex-none"
            onClick={() => handleDownload("xlsx")}
            disabled={exportMutation.isPending && downloadFormat === "xlsx"}
          >
            {exportMutation.isPending && downloadFormat === "xlsx" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 mr-2" />
            )}
            Excel
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
