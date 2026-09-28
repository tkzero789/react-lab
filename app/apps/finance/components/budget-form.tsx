"use client"

/* Form for a budget name and an optional monthly limit */

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import type { Budget } from "../lib/transactions"
import { MAX_NAME_LENGTH } from "@/types/finance"
import { centsToText, parseCents } from "../lib/money"

export type BudgetFormValues = {
  name: string
  monthlyLimitCents?: number
}

type Props = {
  budget?: Budget
  onSubmit: (values: BudgetFormValues) => void
  submitLabel: string
  isPending?: boolean
}

export default function BudgetForm({
  budget,
  onSubmit,
  submitLabel,
  isPending = false,
}: Props) {
  const id = React.useId()
  const [name, setName] = React.useState(budget?.name ?? "")
  const [limit, setLimit] = React.useState(
    budget?.monthlyLimitCents ? centsToText(budget.monthlyLimitCents) : ""
  )
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const limitCents = limit.trim() ? parseCents(limit) : undefined
  const isNameInvalid = isSubmitted && !name.trim()
  const isLimitInvalid = isSubmitted && limitCents === null

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitted(true)
    if (!name.trim() || limitCents === null) return
    onSubmit({ name: name.trim(), monthlyLimitCents: limitCents })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col" noValidate>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className="text-sm font-medium">
            Name
          </label>
          <Input
            id={`${id}-name`}
            placeholder="e.g. Groceries"
            maxLength={MAX_NAME_LENGTH}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={isNameInvalid}
          />
          {isNameInvalid && (
            <p className="text-xs text-destructive">Give the budget a name.</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-limit`} className="text-sm font-medium">
            Monthly limit
          </label>
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput
              id={`${id}-limit`}
              inputMode="decimal"
              placeholder="No limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              aria-invalid={isLimitInvalid}
            />
          </InputGroup>
          {isLimitInvalid ? (
            <p className="text-xs text-destructive">
              Enter an amount more than zero, or leave it empty.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Optional. The budget shows a warning when spending goes over it.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto border-t p-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Spinner />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
