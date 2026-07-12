import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { cn } from "../lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export function KpiCard({ title, value, icon, trend, className }: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden group hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span
              className={cn(
                "font-medium mr-1",
                trend.isPositive === true ? "text-emerald-500" : 
                trend.isPositive === false ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
