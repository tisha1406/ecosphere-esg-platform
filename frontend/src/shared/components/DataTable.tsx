import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react"

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  totalItems?: number
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onSearch?: (term: string) => void
  searchPlaceholder?: string
  exportable?: boolean
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  exportable = true
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    if (onSearch) {
      onSearch(val)
    }
  }

  const handleExport = () => {
    // Placeholder for actual export logic
    const headers = columns.map(c => c.header).join(",")
    const csvData = data.map(row => 
      columns.map(col => {
        if (typeof col.accessor === "function") return "" // Skip complex rendered columns in simple export
        return row[col.accessor]
      }).join(",")
    ).join("\n")
    
    const blob = new Blob([`${headers}\n${csvData}`], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.csv"
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {onSearch ? (
          <div className="flex items-center space-x-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 bg-background"
              />
            </div>
          </div>
        ) : <div />}
        
        {exportable && data.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport} className="ml-2">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>
      
      <div className="rounded-md border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {columns.map((col, i) => (
                <TableHead key={i} className="font-semibold text-foreground/80">{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="group hover:bg-muted/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {onPageChange && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <span className="text-sm text-muted-foreground mr-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
