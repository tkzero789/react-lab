"use client"

/* Spending against each budget limit for the selected month */

import React from "react"
import { TriangleAlertIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { MAX_BUDGETS } from "@/types/finance"
import { formatCents } from "../lib/money"
import {
  getSpentByBudget,
  UNASSIGNED,
  type Budget,
  type Transaction,
} from "../lib/transactions"
import AddBudget from "./add-budget"
import BudgetActions from "./budget-actions"

const COLLAPSED_COUNT = 4

type BudgetStat = {
  budget: Budget
  spentCents: number
  ratio: number | null
}

/* Budgets closest to their limit come first, because they need attention */
function compareStats(a: BudgetStat, b: BudgetStat) {
  if (a.ratio !== null && b.ratio !== null) return b.ratio - a.ratio
  if (a.ratio !== null) return -1
  if (b.ratio !== null) return 1
  return b.spentCents - a.spentCents
}

function BudgetCard({
  title,
  spentCents,
  limitCents,
  actions,
}: {
  title: string
  spentCents: number
  limitCents?: number
  actions?: React.ReactNode
}) {
  const overCents = limitCents !== undefined ? spentCents - limitCents : 0

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex min-h-8 items-center gap-2">
        <span className="truncate font-medium">{title}</span>
        {overCents > 0 && (
          <Badge variant="destructive" className="gap-1">
            <TriangleAlertIcon className="size-3" />
            Over by {formatCents(overCents)}
          </Badge>
        )}
        <div className="ml-auto">{actions}</div>
      </div>

      <div className="flex items-baseline gap-1 tabular-nums">
        <span className="text-lg font-semibold">{formatCents(spentCents)}</span>
        {limitCents !== undefined && (
          <span className="text-sm text-muted-foreground">
            of {formatCents(limitCents)}
          </span>
        )}
      </div>

      {limitCents !== undefined ? (
        <Progress
          value={Math.min(100, (spentCents / limitCents) * 100)}
          aria-label={`${title} spending`}
          className={cn(
            overCents > 0 && "**:data-[slot=progress-indicator]:bg-(--ruby-600)"
          )}
        />
      ) : (
        <p className="text-xs text-muted-foreground">No limit</p>
      )}
    </Card>
  )
}

type Props = {
  budgets: Budget[]
  transactions: Transaction[]
}

export default function BudgetCards({ budgets, transactions }: Props) {
  const [showAll, setShowAll] = React.useState(false)

  const spentByBudget = getSpentByBudget(transactions)
  const unassignedCents = spentByBudget.get(UNASSIGNED) ?? 0
  const stats = budgets
    .map((budget): BudgetStat => {
      const spentCents = spentByBudget.get(budget._id) ?? 0
      return {
        budget,
        spentCents,
        ratio: budget.monthlyLimitCents
          ? spentCents / budget.monthlyLimitCents
          : null,
      }
    })
    .sort(compareStats)
  const visibleStats = showAll ? stats : stats.slice(0, COLLAPSED_COUNT)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Budgets</h3>
        <span className="text-sm text-muted-foreground tabular-nums">
          {budgets.length}/{MAX_BUDGETS}
        </span>
        <div className="ml-auto">
          <AddBudget budgetCount={budgets.length} />
        </div>
      </div>

      {budgets.length === 0 && unassignedCents === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Add a budget to track spending against a monthly limit.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {visibleStats.map(({ budget, spentCents }) => (
            <BudgetCard
              key={budget._id}
              title={budget.name}
              spentCents={spentCents}
              limitCents={budget.monthlyLimitCents}
              actions={<BudgetActions budget={budget} budgets={budgets} />}
            />
          ))}
          {unassignedCents > 0 && (
            <BudgetCard title="Unassigned" spentCents={unassignedCents} />
          )}
        </div>
      )}

      {stats.length > COLLAPSED_COUNT && (
        <Button
          variant="link"
          size="sm"
          className="self-start px-0"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : `Show all ${stats.length} budgets`}
        </Button>
      )}
    </section>
  )
}
