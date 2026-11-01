"use client"

/* Progress and due counts for the todos in the current view */

import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Todo } from "../types"

type Props = {
  open: Todo[]
  completed: Todo[]
}

export default function TodoSummary({ open, completed }: Props) {
  const total = open.length + completed.length
  if (total === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-md border p-3">
      <Progress
        value={completed.length}
        max={total}
        className="min-w-48 flex-1 gap-2"
      >
        <ProgressLabel className="font-normal text-muted-foreground">
          {completed.length} of {total} done
        </ProgressLabel>
      </Progress>
    </div>
  )
}
