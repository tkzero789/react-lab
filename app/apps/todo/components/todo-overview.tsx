"use client"

/* Side panel overview of the todos when no todo is open */

import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns"
import React from "react"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getDateInfo } from "../dates"
import { Todo } from "../types"

const WEEK_LENGTH = 7
const UP_NEXT_LIMIT = 5

type Props = {
  /* Sorted by due date, earliest first */
  open: Todo[]
  completed: Todo[]
  onSelect: (todo: Todo) => void
}

export default function TodoOverview({ open, completed, onSelect }: Props) {
  const id = React.useId()
  const [today] = React.useState(() => startOfDay(Date.now()))

  /* Date 0 means no due date, so these todos stay out of the date counts */
  const dated = open.filter((todo) => todo.date !== 0)
  const offsets = dated.map((todo) =>
    differenceInCalendarDays(todo.date, today)
  )
  const countAt = (offset: number) =>
    offsets.filter((value) => value === offset).length

  const overdue = offsets.filter((offset) => offset < 0).length
  const week = Array.from({ length: WEEK_LENGTH }, (_, offset) => ({
    date: addDays(today, offset),
    count: countAt(offset),
  }))
  const dueThisWeek = week.reduce((sum, day) => sum + day.count, 0)
  const total = open.length + completed.length
  const upNext = dated.slice(0, UP_NEXT_LIMIT)

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-medium">Overview</h2>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, MMMM d")}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open" value={open.length} />
        <Stat label="Overdue" value={overdue} isAlert={overdue > 0} />
        <Stat label="Due today" value={countAt(0)} />
        <Stat label="Next 7 days" value={dueThisWeek} />
      </dl>

      <Progress value={completed.length} max={Math.max(total, 1)}>
        <ProgressLabel>
          {completed.length} of {total} completed
        </ProgressLabel>
        <ProgressValue />
      </Progress>

      <section aria-labelledby={`${id}-week`} className="flex flex-col gap-3">
        <h3 id={`${id}-week`} className="text-sm font-medium">
          This week
        </h3>
        <ol className="grid grid-cols-7 gap-1">
          {week.map((day, offset) => (
            <li
              key={offset}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md border bg-panel-card py-2",
                offset === 0 && "border-ring"
              )}
            >
              <span className="sr-only">
                {format(day.date, "EEEE, MMMM d")}:{" "}
                {day.count === 1 ? "1 todo" : `${day.count} todos`}
              </span>
              <span aria-hidden className="text-xs text-muted-foreground">
                {format(day.date, "EEEEE")}
              </span>
              <span aria-hidden className="text-sm font-medium tabular-nums">
                {format(day.date, "d")}
              </span>
              <span
                aria-hidden
                className={cn(
                  "text-xs tabular-nums",
                  day.count === 0 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day.count === 0 ? "–" : day.count}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby={`${id}-next`} className="flex flex-col gap-3">
        <h3 id={`${id}-next`} className="text-sm font-medium">
          Up next
        </h3>
        {upNext.length > 0 ? (
          <ul className="flex flex-col gap-0.5 rounded-md border bg-panel-card p-1">
            {upNext.map((todo) => (
              <UpNextRow key={todo._id} todo={todo} onSelect={onSelect} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No todo has a due date.
          </p>
        )}
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  isAlert = false,
}: {
  label: string
  value: number
  isAlert?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-panel-card p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-2xl font-medium tabular-nums",
          isAlert && "text-destructive"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function UpNextRow({
  todo,
  onSelect,
}: {
  todo: Todo
  onSelect: (todo: Todo) => void
}) {
  const dateInfo = getDateInfo(todo.date)

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(todo)}
        className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left outline-none hover:bg-button-ghost-hover focus-visible:ring-2 focus-visible:ring-ring active:bg-button-ghost-hover"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {todo.text}
        </span>
        {dateInfo ? (
          <span
            className={cn(
              "shrink-0 text-xs text-muted-foreground",
              dateInfo.tone === "late" && "text-destructive"
            )}
          >
            {dateInfo.label}
          </span>
        ) : null}
      </button>
    </li>
  )
}
