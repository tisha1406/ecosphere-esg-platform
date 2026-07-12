import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useAuditsQuery, useDeleteAuditMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function AuditsTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useAuditsQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteAuditMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const audits = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "audit_date" as const },
    { 
      header: "Score", 
      accessor: (row: any) => (
        <Badge variant={row.score >= 80 ? "default" : row.score >= 60 ? "secondary" : "destructive"}>
          {row.score} / 100
        </Badge>
      )
    },
    { header: "Findings", accessor: "findings" as const },
    {
      header: "Actions",
      accessor: (row: any) => {
        if (isReadOnly) return null;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={audits}
        totalItems={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        loading={isLoading}
        exportable={true}
      />
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
        title="Delete Audit Record"
        description="Are you sure you want to delete this compliance audit? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
