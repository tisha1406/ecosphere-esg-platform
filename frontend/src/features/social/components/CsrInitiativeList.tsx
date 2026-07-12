import React, { useState } from "react";
import { useCsrQuery, useDeleteCsrMutation } from "../hooks";
import { CsrInitiative } from "../schema";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Trash2, Calendar, Users, DollarSign } from "lucide-react";

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

  const initiatives: CsrInitiative[] = data?.data?.items || [];
  const total: number = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (initiatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No CSR initiatives yet</p>
        <p className="text-sm">Create your first initiative to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initiatives.map((item) => {
          const { label, variant } = statusConfig[item.status];
          return (
            <Card
              key={item.id}
              className="group relative overflow-hidden border border-border hover:shadow-md transition-shadow duration-200"
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
              <CardHeader className="pb-2 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                    {item.name}
                  </CardTitle>
                  <Badge variant={variant} className="shrink-0">
                    {label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                    }).format(item.budget)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {item.beneficiaries.toLocaleString()} beneficiaries
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.start_date}
                  {item.end_date && ` → ${item.end_date}`}
                </div>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
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
    </div>
  );
}
