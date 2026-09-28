"use client"

/* Monthly overview of budgets, running totals, and transactions */

import React from "react"
import { convexQuery } from "@convex-dev/react-query"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format, startOfMonth } from "date-fns"
import Loader from "@/components/ui/loader"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import AddTransaction from "./add-transaction"
import BudgetCards from "./budget-cards"
import MonthSummary from "./month-summary"
import MonthSwitcher from "./month-switcher"
import SpendingChart from "./spending-chart"
import TransactionTable from "./transaction-table"

export default function FinanceDashboard() {
  const [month, setMonth] = React.useState(() => startOfMonth(new Date()))
  const { data: budgets } = useQuery(convexQuery(api.budgets.list, {}))
  /* Keep the previous month on screen while the next month loads */
  const { data: transactions, isPlaceholderData } = useQuery({
    ...convexQuery(api.transactions.listByMonth, {
      month: format(month, "yyyy-MM"),
    }),
    placeholderData: keepPreviousData,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MonthSwitcher month={month} onMonthChange={setMonth} />
        <AddTransaction budgets={budgets ?? []} />
      </div>

      {budgets === undefined || transactions === undefined ? (
        <Loader />
      ) : (
        <div
          className={cn(
            "flex flex-col gap-6 transition-opacity",
            isPlaceholderData && "opacity-60"
          )}
        >
          <MonthSummary transactions={transactions} />
          <BudgetCards budgets={budgets} transactions={transactions} />
          <SpendingChart month={month} transactions={transactions} />
          <TransactionTable transactions={transactions} budgets={budgets} />
        </div>
      )}
    </div>
  )
}
