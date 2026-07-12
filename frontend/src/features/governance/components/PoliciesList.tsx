import React, { useState } from "react";
import { usePoliciesQuery, useDeletePolicyMutation } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Trash2, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function PoliciesList({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { data, isLoading } = usePoliciesQuery({ page, page_size: pageSize });
  const deleteMutation = useDeletePolicyMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const policies = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card/50 rounded-lg border border-border/50 border-dashed">
        <ShieldCheck className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No Governance Policies</p>
        <p className="text-sm">Draft or upload your first policy to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((item: any) => {
          return (
            <Card
              key={item.id}
              className="group flex flex-col relative overflow-hidden border border-border/50 hover:shadow-lg hover:border-governance/30 transition-all duration-300 glass-card"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  item.status === "active"
                    ? "bg-governance"
                    : item.status === "draft"
                    ? "bg-amber-500"
                    : "bg-muted-foreground/30"
                }`}
              />
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">
                    {item.status}
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
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium capitalize">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Effective Date</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {item.effective_date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Owner</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.owner_id}`} />
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                      <span className="text-xs max-w-[80px] truncate">{item.owner_id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between">
                <Badge variant="outline" className="text-xs bg-muted/50 font-normal">
                  Acknowledged: 0/0
                </Badge>
                <Button 
                  size="sm"
                  className="bg-governance hover:bg-governance/90 text-white" 
                  disabled 
                  title="Acknowledgements require the Acknowledgement API (coming soon)"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Acknowledge
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
        title="Delete Policy"
        description="Are you sure you want to delete this policy? All acknowledgement records will be lost."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
