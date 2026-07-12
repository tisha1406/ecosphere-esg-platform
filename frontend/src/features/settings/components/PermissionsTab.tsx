import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table";
import { Badge } from "../../../shared/components/ui/badge";
import { Check, X } from "lucide-react";

const permissionsMatrix = [
  { module: "Dashboard", admin: true, esg_manager: true, environmental_officer: true, social_officer: true, governance_officer: true, employee: true },
  { module: "Settings Configuration", admin: true, esg_manager: false, environmental_officer: false, social_officer: false, governance_officer: false, employee: false },
  { module: "User Management", admin: true, esg_manager: false, environmental_officer: false, social_officer: false, governance_officer: false, employee: false },
  { module: "Environmental Core", admin: true, esg_manager: true, environmental_officer: true, social_officer: false, governance_officer: false, employee: false },
  { module: "Social Core", admin: true, esg_manager: true, environmental_officer: false, social_officer: true, governance_officer: false, employee: false },
  { module: "Governance Core", admin: true, esg_manager: true, environmental_officer: false, social_officer: false, governance_officer: true, employee: false },
  { module: "Submit CSR Activities", admin: true, esg_manager: true, environmental_officer: true, social_officer: true, governance_officer: true, employee: true },
  { module: "Acknowledge Policies", admin: true, esg_manager: true, environmental_officer: true, social_officer: true, governance_officer: true, employee: true },
  { module: "View Leaderboard", admin: true, esg_manager: true, environmental_officer: true, social_officer: true, governance_officer: true, employee: true },
];

const roles = [
  { key: "admin", label: "Admin", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  { key: "esg_manager", label: "ESG Manager", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { key: "environmental_officer", label: "Env. Officer", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { key: "social_officer", label: "Social Officer", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { key: "governance_officer", label: "Gov. Officer", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { key: "employee", label: "Employee", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
];

export function PermissionsTab() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Role Permissions Matrix</h3>
        <p className="text-sm text-muted-foreground">
          View-only reference for system access levels. Role assignments can be changed in the User Management tab (Admin only).
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px] font-semibold">Module / Action</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.key} className="text-center">
                    <Badge variant="outline" className={`whitespace-nowrap ${role.color}`}>
                      {role.label}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsMatrix.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-muted-foreground">{row.module}</TableCell>
                  {roles.map((role) => {
                    const hasAccess = row[role.key as keyof typeof row] as boolean;
                    return (
                      <TableCell key={role.key} className="text-center">
                        {hasAccess ? (
                          <Check className="h-5 w-5 mx-auto text-green-500" />
                        ) : (
                          <X className="h-5 w-5 mx-auto text-muted-foreground/30" />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
