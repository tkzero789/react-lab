"use client"

/* Button and dialog that add a budget, up to the per-user cap */

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
import { MAX_BUDGETS } from "@/types/finance"
import BudgetForm, { type BudgetFormValues } from "./budget-form"

export default function AddBudget({ budgetCount }: { budgetCount: number }) {
  const createBudget = useMutation(api.budgets.create)
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const isFull = budgetCount >= MAX_BUDGETS

  function handleCreate(values: BudgetFormValues) {
    startTransition(async () => {
      try {
        await createBudget(values)
        setOpen(false)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not add budget"
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            disabled={isFull}
            title={
              isFull ? `You can have up to ${MAX_BUDGETS} budgets` : undefined
            }
          >
            <Plus data-icon="inline-start" />
            Add Budget
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">
          <BudgetForm
            onSubmit={handleCreate}
            submitLabel="Add Budget"
            isPending={isPending}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
