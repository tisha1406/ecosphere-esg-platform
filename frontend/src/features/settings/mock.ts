export interface DepartmentRow {
  name: string;
  code: string;
  head: string;
  parentDept: string;
  employees: number;
  status: "Active" | "Paused";
}

export const mockDepartments: DepartmentRow[] = [
  { name: "Manufacturing", code: "MFC", head: "S. Nair", parentDept: "—", employees: 134, status: "Active" },
  { name: "Logistics", code: "LOG", head: "R. Iyer", parentDept: "Manufacturing", employees: 58, status: "Active" },
  { name: "Corporate", code: "COF", head: "A. Mehta", parentDept: "—", employees: 41, status: "Active" },
];

export const mockCategoryPills = ["Operations", "Procurement", "Facilities", "Reporting", "Compliance"];

export const mockConfigRows = [
  { label: "Enable auto emission calculation", enabled: true },
  { label: "Require evidence for all CSR activities", enabled: false },
  { label: "Auto-award badges on challenge completion", enabled: true },
  { label: "Email alerts for new compliance issues", enabled: true },
];
