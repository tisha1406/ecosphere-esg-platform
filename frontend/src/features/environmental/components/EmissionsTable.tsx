import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useEmissionsQuery, useDeleteEmissionMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";

export function EmissionsTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useEmissionsQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteEmissionMutation();

  const emissions = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "date" as const },
    { header: "Source", accessor: "source" as const },
    { 
      header: "Scope", 
      accessor: (row: any) => <Badge variant="outline">{row.scope}</Badge>
    },
    { header: "Value (tCO2e)", accessor: "value_tco2e" as const },
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
      data={emissions}
      totalItems={total}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      loading={isLoading}
    />
  );
}
