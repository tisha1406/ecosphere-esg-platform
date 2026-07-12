import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useWellbeingQuery, useDeleteWellbeingMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function WellbeingTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useWellbeingQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteWellbeingMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Employee ID", accessor: (row: any) => row.employee_id.slice(0, 8) + "…" },
    { header: "Date", accessor: "survey_date" as const },
    {
      header: "Score",
      accessor: (row: any) => (
        <Badge
          variant={row.satisfaction_score >= 7 ? "default" : row.satisfaction_score >= 4 ? "secondary" : "outline"}
        >
          {row.satisfaction_score} / 10
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) =>
        !isReadOnly ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
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
        title="Delete Survey Record"
        description="Are you sure you want to delete this wellbeing survey? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
