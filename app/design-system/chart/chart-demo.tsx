"use client"

/* Chart demos, because Recharts renders on the client */
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", visits: 186, signups: 80 },
  { month: "Feb", visits: 305, signups: 120 },
  { month: "Mar", visits: 237, signups: 90 },
  { month: "Apr", visits: 273, signups: 141 },
  { month: "May", visits: 209, signups: 110 },
  { month: "Jun", visits: 314, signups: 160 },
]

const config = {
  visits: { label: "Visits", color: "var(--chart-2)" },
  signups: { label: "Sign ups", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartBar() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-md">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export function ChartMultiple() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-md">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
        <Bar dataKey="signups" fill="var(--color-signups)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export function ChartLine() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-md">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="visits"
          stroke="var(--color-visits)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function ChartArea() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-md">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="visits"
          stroke="var(--color-visits)"
          fill="var(--color-visits)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
