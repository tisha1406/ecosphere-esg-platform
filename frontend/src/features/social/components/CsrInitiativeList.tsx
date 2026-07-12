import React, { useState } from "react";
import { useCsrQuery, useDeleteCsrMutation } from "../hooks";
import { CsrInitiative } from "../schema";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Trash2, Calendar, Users, DollarSign, UploadCloud, HandHeart } from "lucide-react";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

const statusConfig: Record<
  CsrInitiative["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  planned: { label: "Planned", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
};

interface CsrInitiativeListProps {
  isReadOnly: boolean;
}

export function CsrInitiativeList({ isReadOnly }: CsrInitiativeListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { data, isLoading } = useCsrQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteCsrMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const initiatives: CsrInitiative[] = data?.data?.items || [];
  const total: number = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (initiatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card/50 rounded-lg border border-border/50 border-dashed">
        <HandHeart className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No CSR initiatives yet</p>
        <p className="text-sm">Create your first initiative to engage employees.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initiatives.map((item) => {
          const { label, variant } = statusConfig[item.status];
          return (
            <Card
              key={item.id}
              className="group flex flex-col relative overflow-hidden border border-border/50 hover:shadow-lg hover:border-social/30 transition-all duration-300 glass-card"
            >
              {/* Status accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  item.status === "active"
                    ? "bg-social"
                    : item.status === "completed"
                    ? "bg-environmental"
                    : "bg-muted-foreground/30"
                }`}
              />
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={variant} className={item.status === "active" ? "bg-social/15 text-social hover:bg-social/25 border-social/20" : ""}>
                    {label}
                  </Badge>
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 mb-1">
                  {item.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Company-sponsored social responsibility initiative aimed at community engagement and impact.
                </p>
                
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground gap-1.5">
                      <Users className="w-4 h-4 text-social" /> Impact
                    </span>
                    <span className="font-medium">{item.beneficiaries.toLocaleString()} people</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" /> Budget
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(item.budget)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-500" /> Date
                    </span>
                    <span className="font-medium text-xs">
                      {item.start_date}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-border/50 gap-2">
                <Button 
                  className="flex-1 bg-social hover:bg-social/90 text-social-foreground" 
                  disabled 
                  title="Joining initiatives requires the Participation API (coming soon)"
                >
                  <HandHeart className="w-4 h-4 mr-2" />
                  Join
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled 
                  title="Evidence upload requires the Media API (coming soon)"
                >
                  <UploadCloud className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null)
            });
          }
        }}
        title="Delete CSR Initiative"
        description="Are you sure you want to delete this CSR initiative? All associated records will be lost."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
