"use client"

/* Filterable transaction list with bulk budget moves and bulk delete */

import React from "react"
import { useMutation } from "convex/react"
import { format, parseISO } from "date-fns"
import { XIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { formatCents } from "../lib/money"
import {
  getBudgetKey,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  UNASSIGNED,
  type Budget,
  type BudgetKey,
  type Transaction,
} from "../lib/transactions"
import TransactionActions from "./transaction-actions"

const ALL = "all"

type Item<Value extends string = string> = { value: Value; label: string }

function FilterSelect({
  items,
  value,
  onValueChange,
}: {
  items: Item[]
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
    >
      <SelectTrigger className="w-full lg:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function Amount({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income"
  return (
    <span className={cn("font-medium tabular-nums")}>
      {isIncome ? "+" : "−"}
      {formatCents(transaction.amountCents)}
    </span>
  )
}

type Props = {
  transactions: Transaction[]
  budgets: Budget[]
}

export default function TransactionTable({ transactions, budgets }: Props) {
  const setBudget = useMutation(api.transactions.setBudget)
  const removeTransactions = useMutation(api.transactions.remove)

  const [typeFilter, setTypeFilter] = React.useState(ALL)
  const [budgetFilter, setBudgetFilter] = React.useState(ALL)
  const [methodFilter, setMethodFilter] = React.useState(ALL)
  const [selectedIds, setSelectedIds] = React.useState<Set<Id<"transactions">>>(
    () => new Set()
  )

  const budgetNames = new Map(budgets.map((b) => [b._id, b.name]))
  const budgetItems: Item<BudgetKey>[] = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...budgets.map((b) => ({ value: b._id, label: b.name })),
  ]

  const visible = transactions.filter((t) => {
    if (typeFilter !== ALL && t.type !== typeFilter) return false
    if (budgetFilter === ALL && methodFilter === ALL) return true
    if (t.type !== "expense") return false
    if (budgetFilter !== ALL && getBudgetKey(t) !== budgetFilter) return false
    if (methodFilter !== ALL && t.paymentMethod !== methodFilter) return false
    return true
  })

  /* Derive the selection from the visible rows, so a bulk action never touches a hidden row */
  const selected = visible.filter((t) => selectedIds.has(t._id))
  const selectedHasIncome = selected.some((t) => t.type === "income")
  const allSelected = visible.length > 0 && selected.length === visible.length

  function toggle(id: Id<"transactions">, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(new Set(checked ? visible.map((t) => t._id) : []))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function handleMove(key: BudgetKey) {
    setBudget({
      ids: selected.map((t) => t._id),
      budgetId: key === UNASSIGNED ? undefined : key,
    })
      .then(clearSelection)
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Could not move transactions"
        )
      )
  }

  function handleDelete() {
    removeTransactions({ ids: selected.map((t) => t._id) })
      .then(clearSelection)
      .catch(() => toast.error("Could not delete transactions"))
  }

  function getBudgetLabel(t: Transaction) {
    if (t.type === "income") return "Income"
    if (!t.budgetId) return "Unassigned"
    return budgetNames.get(t.budgetId) ?? "Unknown"
  }

  function getDetails(t: Transaction) {
    if (t.type === "income") return "Income"
    return `${getBudgetLabel(t)} · ${PAYMENT_METHOD_LABELS[t.paymentMethod]}`
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-semibold">Transactions</h3>

      <div className="flex flex-col gap-2 lg:flex-row">
        <FilterSelect
          value={typeFilter}
          onValueChange={setTypeFilter}
          items={[
            { value: ALL, label: "All types" },
            { value: "expense", label: "Expenses" },
            { value: "income", label: "Income" },
          ]}
        />
        <FilterSelect
          value={budgetFilter}
          onValueChange={setBudgetFilter}
          items={[{ value: ALL, label: "All budgets" }, ...budgetItems]}
        />
        <FilterSelect
          value={methodFilter}
          onValueChange={setMethodFilter}
          items={[
            { value: ALL, label: "All payment methods" },
            ...PAYMENT_METHODS.map((m) => ({
              value: m,
              label: PAYMENT_METHOD_LABELS[m],
            })),
          ]}
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clearSelection}
            aria-label="Clear selection"
          >
            <XIcon />
          </Button>
          <span className="text-sm font-medium tabular-nums">
            {selected.length} selected
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectedHasIncome ? (
              <span className="text-xs text-muted-foreground">
                Income has no budget
              </span>
            ) : (
              <Select<BudgetKey>
                items={budgetItems}
                value={null}
                onValueChange={(key) => key && handleMove(key)}
              >
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Move to budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {budgetItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogDescription>
                    Delete {selected.length}{" "}
                    {selected.length === 1 ? "transaction" : "transactions"}?
                    You cannot undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          {transactions.length === 0
            ? "No transactions this month."
            : "No transactions match your filters."}
        </p>
      ) : (
        <>
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selected.length > 0 && !allSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all transactions"
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Paid with</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((t) => (
                  <TableRow
                    key={t._id}
                    data-state={selectedIds.has(t._id) ? "selected" : undefined}
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedIds.has(t._id)}
                        onCheckedChange={(checked) => toggle(t._id, checked)}
                        aria-label="Select transaction"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(parseISO(t.date), "MMM d")}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {t.note ?? (
                        <span className="text-muted-foreground">No note</span>
                      )}
                    </TableCell>
                    <TableCell>{getBudgetLabel(t)}</TableCell>
                    <TableCell>
                      {t.type === "expense" &&
                        PAYMENT_METHOD_LABELS[t.paymentMethod]}
                    </TableCell>
                    <TableCell className="text-right">
                      <Amount transaction={t} />
                    </TableCell>
                    <TableCell>
                      <TransactionActions transaction={t} budgets={budgets} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="flex flex-col divide-y rounded-lg border md:hidden">
            <li className="flex items-center gap-3 px-3 py-2">
              <Checkbox
                checked={allSelected}
                indeterminate={selected.length > 0 && !allSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all transactions"
              />
              <span className="text-xs text-muted-foreground">Select all</span>
            </li>
            {visible.map((t) => (
              <li
                key={t._id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2",
                  selectedIds.has(t._id) && "bg-muted"
                )}
              >
                <Checkbox
                  checked={selectedIds.has(t._id)}
                  onCheckedChange={(checked) => toggle(t._id, checked)}
                  aria-label="Select transaction"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {t.note ?? getDetails(t)}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {format(parseISO(t.date), "MMM d")}
                    {t.note && ` · ${getDetails(t)}`}
                  </span>
                </div>
                <Amount transaction={t} />
                <TransactionActions transaction={t} budgets={budgets} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
