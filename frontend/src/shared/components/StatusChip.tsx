import React from "react"
import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

export type StatusType = "success" | "warning" | "danger" | "info" | "default"

interface StatusChipProps {
  status: StatusType
  label: string
  className?: string
}

const statusVariants: Record<StatusType, string> = {
  success: "bg-success/15 text-success hover:bg-success/25 border-success/20",
  warning: "bg-warning/15 text-warning hover:bg-warning/25 border-warning/20",
  danger: "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20",
  info: "bg-info/15 text-info hover:bg-info/25 border-info/20",
  default: "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium transition-colors border", statusVariants[status], className)}
    >
      {label}
    </Badge>
  )
}

export type SeverityType = "low" | "medium" | "high" | "critical"

interface SeverityBadgeProps {
  severity: SeverityType
  className?: string
}

const severityConfig: Record<SeverityType, { color: string; label: string }> = {
  low: { color: "bg-info/15 text-info border-info/20", label: "Low" },
  medium: { color: "bg-warning/15 text-warning border-warning/20", label: "Medium" },
  high: { color: "bg-orange-500/15 text-orange-500 border-orange-500/20", label: "High" },
  critical: { color: "bg-destructive/15 text-destructive border-destructive/20", label: "Critical" },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  
  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium uppercase tracking-wider text-[10px] border", config.color, className)}
    >
      {config.label}
    </Badge>
  )
}
