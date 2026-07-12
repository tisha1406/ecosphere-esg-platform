import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useEmissionsQuery, useDeleteEmissionMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function EmissionsTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useEmissionsQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteEmissionMutation();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emissions = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "date" as const },
    { header: "Source", accessor: "source" as const },
    { 
      header: "Scope", 
      accessor: (row: any) => <Badge variant="outline" className="capitalize">{row.scope.replace("_", " ")}</Badge>
    },
    { header: "Value (tCO2e)", accessor: "value_tco2e" as const },
    {
      header: "Actions",
      accessor: (row: any) => {
        if (isReadOnly) return null;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
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
        data={emissions}
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
        title="Delete Emission Record"
        description="Are you sure you want to delete this carbon emission record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
