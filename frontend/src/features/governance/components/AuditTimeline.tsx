import React from "react";
import { useAuditsQuery } from "../hooks";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Badge } from "../../../shared/components/ui/badge";
import { CalendarClock, ShieldCheck } from "lucide-react";

export function AuditTimeline() {
  const { data, isLoading } = useAuditsQuery({ page: 1, page_size: 50 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const audits = data?.data?.items || [];
  if (audits.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No audits recorded.</div>;
  }

  // Sort by date descending
  const sortedAudits = [...audits].sort(
    (a, b) => new Date(b.audit_date).getTime() - new Date(a.audit_date).getTime()
  );

  const today = new Date().toISOString().split('T')[0];
  const upcoming = sortedAudits.filter(a => a.audit_date > today).reverse();
  const past = sortedAudits.filter(a => a.audit_date <= today).slice(0, 5); // show last 5

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <CalendarClock className="w-4 h-4" /> Upcoming Audits
          </h4>
          <div className="relative border-l-2 border-governance/30 ml-3 space-y-6">
            {upcoming.map((audit: any) => (
              <div key={audit.id} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-background border-2 border-governance rounded-full -left-[7px] top-1.5" />
                <div className="bg-card/50 p-4 rounded-lg border border-governance/20 shadow-sm glass-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-governance">{audit.audit_date}</span>
                    <Badge variant="outline" className="bg-governance/10 text-governance border-governance/20">Planned</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{audit.findings || "Audit scope and findings will be recorded here."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Recent Audits
          </h4>
          <div className="relative border-l-2 border-border ml-3 space-y-6">
            {past.map((audit: any) => {
              const isGood = audit.score >= 80;
              const isWarn = audit.score >= 60 && audit.score < 80;
              const statusColor = isGood ? "bg-emerald-500" : isWarn ? "bg-amber-500" : "bg-destructive";
              
              return (
                <div key={audit.id} className="relative pl-6">
                  <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ${statusColor}`} />
                  <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm glass-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{audit.audit_date}</span>
                      <Badge variant={isGood ? "default" : isWarn ? "secondary" : "destructive"}>
                        Score: {audit.score}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{audit.findings}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
