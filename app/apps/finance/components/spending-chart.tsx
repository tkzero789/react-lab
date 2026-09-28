"use client"

/* Running income and expense totals across the selected month */

import { format, getDaysInMonth, isSameMonth, setDate } from "date-fns"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCents, formatCompactCents } from "../lib/money"
import type { Transaction } from "../lib/transactions"

/* The repo chart tokens are gray. These hues pass the palette validator on both card surfaces. */
const config = {
  income: { label: "Income", theme: { light: "#2a78d6", dark: "#3987e5" } },
  expenses: { label: "Expenses", theme: { light: "#eb6834", dark: "#d95926" } },
} satisfies ChartConfig

type Point = { day: number; income: number; expenses: number }

function getRunningTotals(month: Date, transactions: Transaction[]) {
  const today = new Date()
  /* Stop at today, so the lines do not show a flat future */
  const lastDay = isSameMonth(month, today)
    ? today.getDate()
    : getDaysInMonth(month)

  const daily = new Map<number, { income: number; expenses: number }>()
  for (const t of transactions) {
    const day = Number(t.date.slice(8, 10))
    const totals = daily.get(day) ?? { income: 0, expenses: 0 }
    if (t.type === "income") totals.income += t.amountCents
    else totals.expenses += t.amountCents
    daily.set(day, totals)
  }

  const points: Point[] = []
  let income = 0
  let expenses = 0
  for (let day = 1; day <= lastDay; day++) {
    income += daily.get(day)?.income ?? 0
    expenses += daily.get(day)?.expenses ?? 0
    points.push({ day, income, expenses })
  }
  return points
}

type Props = {
  month: Date
  transactions: Transaction[]
}

export default function SpendingChart({ month, transactions }: Props) {
  const data = getRunningTotals(month, transactions)

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4">
      <h3 className="font-semibold">Income vs spending</h3>
      <ChartContainer config={config} className="h-56 w-full">
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(cents: number) => formatCompactCents(cents)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  format(setDate(month, payload[0]?.payload.day), "MMM d")
                }
                formatter={(value, name, item) => (
                  <>
                    <div
                      className="size-2.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-1 justify-between gap-4 leading-none">
                      <span className="text-muted-foreground">
                        {config[name as keyof typeof config].label}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatCents(Number(value))}
                      </span>
                    </div>
                  </>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="income"
            type="linear"
            stroke="var(--color-income)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="expenses"
            type="linear"
            stroke="var(--color-expenses)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </section>
  )
}
