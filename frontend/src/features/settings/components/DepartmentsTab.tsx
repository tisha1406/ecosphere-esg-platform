import React, { useState } from "react";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "../hooks";
import { Button } from "../../../shared/components/ui/button";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export function DepartmentsTab() {
  const { data: response, isLoading } = useDepartments();
  const departments = response?.data || [];
  const createDept = useCreateDepartment();
  const deleteDept = useDeleteDepartment();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleCreate = () => {
    const name = prompt("Enter department name:");
    if (!name) return;
    const code = prompt("Enter department code (e.g. ENG):");
    if (!code) return;
    createDept.mutate({ name, code, status: "active", employee_count: 0 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDept.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Departments</h3>
          <p className="text-sm text-muted-foreground">
            Manage organizational departments and sub-divisions.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      <div className="rounded-md border border-border/50">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Employees</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((dept: any) => (
                <tr key={dept.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{dept.name}</td>
                  <td className="px-4 py-3">{dept.code}</td>
                  <td className="px-4 py-3">{dept.employee_count}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
