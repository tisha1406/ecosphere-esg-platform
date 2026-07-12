import React from "react"
import { cn } from "../lib/utils"
import { ScoreBand } from "../types/api.types"

interface ScoreGaugeProps {
  score: number
  maxScore?: number
  label?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ScoreGauge({
  score,
  maxScore = 100,
  label,
  className,
  size = "md"
}: ScoreGaugeProps) {
  const percentage = Math.min(Math.max(score / maxScore, 0), 1)
  
  let band: ScoreBand = "low"
  if (score >= 70) band = "high"
  else if (score >= 40) band = "medium"

  const sizeMap = {
    sm: { svg: 80, stroke: 6, font: "text-lg", labelFont: "text-xs" },
    md: { svg: 120, stroke: 10, font: "text-2xl", labelFont: "text-sm" },
    lg: { svg: 160, stroke: 14, font: "text-4xl", labelFont: "text-base" },
  }

  const { svg, stroke, font, labelFont } = sizeMap[size]
  const radius = (svg - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - percentage * circumference

  const colorClass = 
    band === "high" ? "text-environmental" :
    band === "medium" ? "text-yellow-500" :
    "text-destructive"

  return (
    <div className={cn("flex flex-col items-center justify-center relative", className)}>
      <svg
        width={svg}
        height={svg}
        className="transform -rotate-90 transition-all duration-1000 ease-in-out"
      >
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={radius}
          className="text-muted stroke-current"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={radius}
          className={cn("stroke-current transition-all duration-1000 ease-in-out", colorClass)}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", font, colorClass)}>
          {score}
        </span>
      </div>
      {label && (
        <span className={cn("mt-2 font-medium text-muted-foreground", labelFont)}>
          {label}
        </span>
      )}
    </div>
  )
}
