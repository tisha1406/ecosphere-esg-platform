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
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

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
  searchPlaceholder = "Search..."
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

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i}>{col.header}</TableHead>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
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
