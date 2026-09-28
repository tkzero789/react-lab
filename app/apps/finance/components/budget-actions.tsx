"use client"

/* Edit and delete menu for a budget card */

import React from "react"
import { useMutation, useQuery } from "convex/react"
import { EllipsisIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/convex/_generated/api"
import { toast } from "@/lib/toast"
import { UNASSIGNED, type Budget, type BudgetKey } from "../lib/transactions"
import BudgetForm, { type BudgetFormValues } from "./budget-form"
import ResponsiveDialog from "./responsive-dialog"

type Props = {
  budget: Budget
  budgets: Budget[]
}

type View = "edit" | "delete" | null

export default function BudgetActions({ budget, budgets }: Props) {
  const updateBudget = useMutation(api.budgets.update)
  const removeBudget = useMutation(api.budgets.remove)
  const [view, setView] = React.useState<View>(null)
  const [moveTo, setMoveTo] = React.useState<BudgetKey>(UNASSIGNED)
  const [isPending, startTransition] = React.useTransition()

  /* Count only while the delete dialog is open, so each card does not load all its transactions */
  const transactionCount = useQuery(
    api.budgets.transactionCount,
    view === "delete" ? { id: budget._id } : "skip"
  )

  const moveItems: { value: BudgetKey; label: string }[] = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...budgets
      .filter((b) => b._id !== budget._id)
      .map((b) => ({ value: b._id, label: b.name })),
  ]

  function close() {
    setView(null)
    setMoveTo(UNASSIGNED)
  }

  function handleUpdate(values: BudgetFormValues) {
    startTransition(async () => {
      try {
        await updateBudget({ id: budget._id, ...values })
        close()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save budget"
        )
      }
    })
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeBudget({
          id: budget._id,
          moveTo: moveTo === UNASSIGNED ? undefined : moveTo,
        })
        close()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not delete budget"
        )
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Budget actions">
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setView("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setView("delete")}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        open={view === "edit"}
        onOpenChange={(open) => !open && close()}
        title="Edit Budget"
      >
        <BudgetForm
          budget={budget}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          isPending={isPending}
        />
      </ResponsiveDialog>

      <AlertDialog
        open={view === "delete"}
        onOpenChange={(open) => !open && close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {budget.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {transactionCount === undefined
                ? "Checking for transactions in this budget."
                : transactionCount === 0
                  ? "No transactions use this budget."
                  : `${transactionCount} ${transactionCount === 1 ? "transaction uses" : "transactions use"} this budget in all months. Choose where to move them.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {transactionCount !== undefined && transactionCount > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Move to</span>
              <Select<BudgetKey>
                items={moveItems}
                value={moveTo}
                onValueChange={(value) => value && setMoveTo(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {moveItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={transactionCount === undefined || isPending}
              onClick={handleRemove}
            >
              {isPending && <Spinner />}
              {transactionCount ? "Move and Delete" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
