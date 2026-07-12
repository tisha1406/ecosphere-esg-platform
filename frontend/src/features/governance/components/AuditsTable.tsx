import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useAuditsQuery, useDeleteAuditMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";

export function AuditsTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useAuditsQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteAuditMutation();

  const audits = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "audit_date" as const },
    { header: "Score", accessor: "score" as const },
    { header: "Findings", accessor: "findings" as const },
    {
      header: "Actions",
      accessor: (row: any) => {
        if (isReadOnly) return null;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(row.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={audits}
      totalItems={total}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      loading={isLoading}
    />
  );
}
