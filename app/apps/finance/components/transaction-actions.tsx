"use client"

/* Edit and delete menu for one transaction */

import React from "react"
import { useMutation } from "convex/react"
import { EllipsisIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { toast } from "@/lib/toast"
import type { Budget, Transaction } from "../lib/transactions"
import ResponsiveDialog from "./responsive-dialog"
import TransactionForm, { type TransactionInput } from "./transaction-form"

type Props = {
  transaction: Transaction
  budgets: Budget[]
}

type View = "edit" | "delete" | null

export default function TransactionActions({ transaction, budgets }: Props) {
  const updateTransaction = useMutation(api.transactions.update)
  const removeTransactions = useMutation(api.transactions.remove)
  const [view, setView] = React.useState<View>(null)
  const [isPending, startTransition] = React.useTransition()

  function close() {
    setView(null)
  }

  function handleUpdate(input: TransactionInput) {
    startTransition(async () => {
      try {
        await updateTransaction({ id: transaction._id, transaction: input })
        close()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save transaction"
        )
      }
    })
  }

  function handleRemove() {
    removeTransactions({ ids: [transaction._id] }).catch(() =>
      toast.error("Could not delete transaction")
    )
    close()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Transaction actions"
            >
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
        title="Edit Transaction"
      >
        <TransactionForm
          budgets={budgets}
          transaction={transaction}
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
            <AlertDialogDescription>
              Delete this transaction? You cannot undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRemove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
