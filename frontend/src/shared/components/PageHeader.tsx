import React from "react"
import { cn } from "../lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  iconBg?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, icon, iconBg, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn("p-2.5 rounded-xl shrink-0", iconBg || "bg-muted")}>
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
