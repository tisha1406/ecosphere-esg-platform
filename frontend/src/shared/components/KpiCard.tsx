import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { cn } from "../lib/utils"

export type KpiVariant = "neutral" | "overall" | "environmental" | "social" | "governance" | "gamification"

const variantStyles: Record<KpiVariant, { gradient: string, text: string }> = {
  neutral: { gradient: "border-border/50 bg-card/80", text: "" },
  overall: { gradient: "from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-br", text: "text-primary" },
  environmental: { gradient: "from-environmental/10 to-environmental/5 border-environmental/20 bg-gradient-to-br", text: "text-environmental" },
  social: { gradient: "from-blue-500/10 to-blue-500/5 border-blue-500/20 bg-gradient-to-br", text: "text-blue-600 dark:text-blue-400" },
  governance: { gradient: "from-violet-500/10 to-violet-500/5 border-violet-500/20 bg-gradient-to-br", text: "text-violet-600 dark:text-violet-400" },
  gamification: { gradient: "from-amber-500/10 to-amber-500/5 border-amber-500/20 bg-gradient-to-br", text: "text-amber-600 dark:text-amber-400" },
}

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  variant?: KpiVariant
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  isLoading?: boolean
  className?: string
}

export function KpiCard({ title, value, icon, variant = "neutral", trend, isLoading, className }: KpiCardProps) {
  if (isLoading) {
    return <Skeleton className={cn("h-32 w-full rounded-xl", className)} />
  }

  const styles = variantStyles[variant]
  return (
    <Card className={cn("overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 backdrop-blur-sm", styles.gradient, className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon && <div className={cn("transition-colors duration-300", styles.text || "text-muted-foreground group-hover:text-primary")}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold tabular-nums tracking-tight", styles.text)}>{value}</div>
        {trend && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center font-medium">
            <span
              className={cn(
                "mr-1.5 flex items-center",
                trend.isPositive === true ? "text-success" : 
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
