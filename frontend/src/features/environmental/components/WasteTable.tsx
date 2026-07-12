import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useWasteQuery, useDeleteWasteMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";

export function WasteTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useWasteQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteWasteMutation();

  const waste = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "date" as const },
    { 
      header: "Type", 
      accessor: (row: any) => <Badge variant="outline">{row.waste_type}</Badge>
    },
    { header: "Recycled (kg)", accessor: "kg_recycled" as const },
    { header: "Landfill (kg)", accessor: "kg_landfill" as const },
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
      data={waste}
      totalItems={total}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      loading={isLoading}
    />
  );
}
