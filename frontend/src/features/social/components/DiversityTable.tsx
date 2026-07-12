import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useDiversityQuery, useDeleteDiversityMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function DiversityTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useDiversityQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteDiversityMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Period", accessor: "period" as const },
    { header: "Dept ID", accessor: (row: any) => row.department_id.slice(0, 8) + "…" },
    {
      header: "Gender Ratio",
      accessor: (row: any) => `${Math.round(row.gender_ratio * 100)}%`,
    },
    {
      header: "Inclusion Score",
      accessor: (row: any) => (
        <Badge variant={row.inclusion_score >= 70 ? "default" : "secondary"}>
          {row.inclusion_score.toFixed(1)}
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
        title="Delete Diversity Record"
        description="Are you sure you want to delete this diversity metric? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
