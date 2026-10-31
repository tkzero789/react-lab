"use client"

/* Progress and due counts for the todos in the current view */

import { Progress, ProgressLabel } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getDateInfo } from "../dates"
import { Todo } from "../types"

type Props = {
  open: Todo[]
  completed: Todo[]
}

export default function TodoSummary({ open, completed }: Props) {
  const total = open.length + completed.length
  if (total === 0) return null

  const groups = open.map((todo) => getDateInfo(todo.date)?.group)
  const overdue = groups.filter((group) => group === "overdue").length
  const dueToday = groups.filter((group) => group === "today").length

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
      <dl className="flex gap-4 text-sm">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-muted-foreground">Overdue</dt>
          <dd
            className={cn(
              "leading-none font-medium tabular-nums",
              overdue > 0 && "text-destructive"
            )}
          >
            {overdue}
          </dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-muted-foreground">Due today</dt>
          <dd className="leading-none font-medium tabular-nums">{dueToday}</dd>
        </div>
      </dl>
    </div>
  )
}
