import React, { useState } from "react";
import { DataTable } from "../../../shared/components/DataTable";
import { useEnergyQuery, useDeleteEnergyMutation } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function EnergyTable({ isReadOnly }: { isReadOnly: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useEnergyQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteEnergyMutation();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const energy = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const columns = [
    { header: "Date", accessor: "date" as const },
    { 
      header: "Type", 
      accessor: (row: any) => <Badge variant="secondary" className="capitalize">{row.energy_type}</Badge>
    },
    { header: "Consumed (kWh)", accessor: "kwh_consumed" as const },
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
        data={energy}
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
        title="Delete Energy Record"
        description="Are you sure you want to delete this energy usage record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
