"use client"

/* Form for an income or expense transaction */

import React from "react"
import type { FunctionArgs } from "convex/server"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { api } from "@/convex/_generated/api"
import { MAX_NOTE_LENGTH } from "@/types/finance"
import DatePicker from "../../components/date-picker"
import { centsToText, parseCents } from "../lib/money"
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  UNASSIGNED,
  type Budget,
  type BudgetKey,
  type PaymentMethod,
  type Transaction,
  type TransactionType,
} from "../lib/transactions"

export type TransactionInput = FunctionArgs<
  typeof api.transactions.add
>["transaction"]

type Props = {
  budgets: Budget[]
  transaction?: Transaction
  onSubmit: (input: TransactionInput) => void
  submitLabel: string
  isPending?: boolean
}

const labelClass = "text-sm font-medium"

export default function TransactionForm({
  budgets,
  transaction,
  onSubmit,
  submitLabel,
  isPending = false,
}: Props) {
  const id = React.useId()
  const expense = transaction?.type === "expense" ? transaction : undefined

  const [type, setType] = React.useState<TransactionType>(
    transaction?.type ?? "expense"
  )
  const [amount, setAmount] = React.useState(
    transaction ? centsToText(transaction.amountCents) : ""
  )
  /* The local date, because toISOString() gives the UTC date */
  const [date, setDate] = React.useState(() =>
    transaction ? parseISO(transaction.date) : new Date()
  )
  const [budgetKey, setBudgetKey] = React.useState<BudgetKey>(
    expense?.budgetId ?? UNASSIGNED
  )
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    expense?.paymentMethod ?? "credit"
  )
  const [note, setNote] = React.useState(transaction?.note ?? "")
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const amountCents = parseCents(amount)
  const isAmountInvalid = isSubmitted && amountCents === null

  const budgetItems: { value: BudgetKey; label: string }[] = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...budgets.map((b) => ({ value: b._id, label: b.name })),
  ]

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitted(true)
    if (amountCents === null) return

    const base = {
      amountCents,
      date: format(date, "yyyy-MM-dd"),
      note: note.trim() || undefined,
    }
    onSubmit(
      type === "income"
        ? { ...base, type }
        : {
            ...base,
            type,
            paymentMethod,
            budgetId: budgetKey === UNASSIGNED ? undefined : budgetKey,
          }
    )
  }

  /* Both panels show these fields. Only the active panel mounts, so the IDs stay unique. */
  const amountField = (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-amount`} className={labelClass}>
        Amount
      </label>
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput
          id={`${id}-amount`}
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={isAmountInvalid}
          aria-describedby={isAmountInvalid ? `${id}-amount-error` : undefined}
        />
      </InputGroup>
      {isAmountInvalid && (
        <p id={`${id}-amount-error`} className="text-xs text-destructive">
          Enter an amount more than zero, like 12.99.
        </p>
      )}
    </div>
  )

  const dateField = (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>Date</label>
      <DatePicker id={`${id}-date`} value={date} onChange={setDate} />
    </div>
  )

  const noteField = (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-note`} className={labelClass}>
        Note
      </label>
      <Input
        id={`${id}-note`}
        placeholder={type === "income" ? "e.g. Salary" : "e.g. Coffee"}
        maxLength={MAX_NOTE_LENGTH}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col" noValidate>
      <Tabs
        value={type}
        onValueChange={(value: TransactionType) => setType(value)}
        className="gap-4 p-4"
      >
        <TabsList className="w-full">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="flex flex-col gap-4">
          {amountField}
          {dateField}

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Budget</span>
            <Select<BudgetKey>
              items={budgetItems}
              value={budgetKey}
              onValueChange={(value) => value && setBudgetKey(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Paid with</span>
            <ToggleGroup
              variant="outline"
              spacing={0}
              value={[paymentMethod]}
              onValueChange={([next]) =>
                next && setPaymentMethod(next as PaymentMethod)
              }
              className="w-full"
            >
              {PAYMENT_METHODS.map((method) => (
                <ToggleGroupItem key={method} value={method} className="flex-1">
                  {PAYMENT_METHOD_LABELS[method]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {noteField}
        </TabsContent>

        <TabsContent value="income" className="flex flex-col gap-4">
          {amountField}
          {dateField}
          {noteField}
        </TabsContent>
      </Tabs>

      <div className="mt-auto border-t p-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Spinner />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
