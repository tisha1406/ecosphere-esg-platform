import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { usePoliciesQuery, useDeletePolicyMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";

export function PoliciesTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = usePoliciesQuery({ page, page_size: pageSize });
  const deleteMutation = useDeletePolicyMutation();

  const policies = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Category", accessor: "category" as const },
    { 
      header: "Status", 
      accessor: (row: any) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      )
    },
    { header: "Effective Date", accessor: "effective_date" as const },
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
      data={policies}
      totalItems={total}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      loading={isLoading}
    />
  );
}
