/* Income, expense, and net totals for the selected month */

import { cn } from "@/lib/utils"
import { formatCents } from "../lib/money"
import { getTotals, type Transaction } from "../lib/transactions"

function Tile({
  label,
  cents,
  className,
}: {
  label: string
  cents: number
  className?: string
}) {
  return (
    <div className="flex-1 rounded-lg border p-3">
      <p className={cn("text-lg font-semibold tabular-nums", className)}>
        {formatCents(cents)}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export default function MonthSummary({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const { incomeCents, expenseCents, netCents } = getTotals(transactions)

  return (
    <div className="flex gap-2">
      <Tile label="Income" cents={incomeCents} />
      <Tile label="Expenses" cents={expenseCents} />
      <Tile
        label="Net"
        cents={netCents}
        className={cn(netCents < 0 && "text-(--ruby-600)")}
      />
    </div>
  )
}
