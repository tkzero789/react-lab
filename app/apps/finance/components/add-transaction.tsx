"use client"

/* Button and dialog that add a transaction */

import React from "react"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { toast } from "@/lib/toast"
import type { Budget } from "../lib/transactions"
import TransactionForm, { type TransactionInput } from "./transaction-form"

export default function AddTransaction({ budgets }: { budgets: Budget[] }) {
  const addTransaction = useMutation(api.transactions.add)
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  function handleAdd(transaction: TransactionInput) {
    startTransition(async () => {
      try {
        await addTransaction({ transaction })
        setOpen(false)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not add transaction"
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus data-icon="inline-start" />
            Add Transaction
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">
          <TransactionForm
            budgets={budgets}
            onSubmit={handleAdd}
            submitLabel="Add Transaction"
            isPending={isPending}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
