import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"

type ChartType = "line" | "bar" | "pie"

interface ChartWidgetProps {
  title: string
  description?: string
  data: any[]
  type: ChartType
  xKey?: string
  series?: { key: string; name: string; color: string }[]
  pieDataKey?: string
  pieNameKey?: string
  height?: number
}

export function ChartWidget({
  title,
  description,
  data,
  type,
  xKey = "name",
  series = [],
  pieDataKey = "value",
  pieNameKey = "name",
  height = 300
}: ChartWidgetProps) {
  
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {series.map((s, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {series.map((s, i) => (
                <Bar key={i} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Pie
                data={data}
                dataKey={pieDataKey}
                nameKey={pieNameKey}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {data.map((entry, index) => {
                  const color = series.find(s => s.key === entry[pieNameKey])?.color || `hsl(var(--primary))`
                  return <Cell key={`cell-${index}`} fill={color} />
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }} className="w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}
