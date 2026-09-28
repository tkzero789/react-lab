/* Types and totals for finance transactions and budgets */

import type { Doc, Id } from "@/convex/_generated/dataModel"

export type Budget = Doc<"budgets">
export type Transaction = Doc<"transactions">
export type Expense = Extract<Transaction, { type: "expense" }>
export type TransactionType = Transaction["type"]
export type PaymentMethod = Expense["paymentMethod"]

/* Select values must be strings, so this key stands for "no budget" */
export const UNASSIGNED = "unassigned"
export type BudgetKey = Id<"budgets"> | typeof UNASSIGNED

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit: "Credit card",
  debit: "Debit",
  cash: "Cash",
}

export const PAYMENT_METHODS = Object.keys(
  PAYMENT_METHOD_LABELS
) as PaymentMethod[]

export function getBudgetKey(transaction: Expense): BudgetKey {
  return transaction.budgetId ?? UNASSIGNED
}

export function getTotals(transactions: Transaction[]) {
  let incomeCents = 0
  let expenseCents = 0
  for (const t of transactions) {
    if (t.type === "income") incomeCents += t.amountCents
    else expenseCents += t.amountCents
  }
  return { incomeCents, expenseCents, netCents: incomeCents - expenseCents }
}

export function getSpentByBudget(transactions: Transaction[]) {
  const spent = new Map<BudgetKey, number>()
  for (const t of transactions) {
    if (t.type !== "expense") continue
    const key = getBudgetKey(t)
    spent.set(key, (spent.get(key) ?? 0) + t.amountCents)
  }
  return spent
}
