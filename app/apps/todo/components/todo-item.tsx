"use client"

/* Compact todo row for the list pane. A click on the row opens the todo in the side panel. */

import { CheckIcon } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"
import { DateTone, getDateInfo } from "../dates"
import { Todo } from "../types"

const TONE_CLASS: Record<DateTone, string> = {
  late: "text-destructive",
  now: "text-foreground",
  soon: "",
  far: "",
}

type Props = {
  todo: Todo
  isSelected: boolean
  onSelect: (todo: Todo) => void
  onToggle: (todo: Todo) => void
}

export default function TodoItem({
  todo,
  isSelected,
  onSelect,
  onToggle,
}: Props) {
  const isCompleted = todo.status === "completed"
  const dateInfo = isCompleted ? null : getDateInfo(todo.date)
  const fileCount = todo.imageObject.filter(Boolean).length

  const meta = [
    dateInfo ? (
      <span className={TONE_CLASS[dateInfo.tone]}>{dateInfo.label}</span>
    ) : null,
    todo.location || null,
    fileCount > 0 ? (fileCount === 1 ? "1 file" : `${fileCount} files`) : null,
  ].filter((part) => part !== null)

  return (
    <li
      className={cn(
        "flex items-center gap-1 rounded-md pr-2 transition-colors",
        isSelected
          ? "bg-muted"
          : "hover:bg-button-ghost-hover active:bg-button-ghost-hover"
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(todo)}
        aria-pressed={isCompleted}
        aria-label={
          isCompleted ? `Reopen “${todo.text}”` : `Complete “${todo.text}”`
        }
        className="group/toggle pressable flex size-9 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={cn(
            "flex size-4.5 items-center justify-center rounded-full border-[1.5px] border-ring transition-colors group-hover/toggle:border-foreground group-active/toggle:border-foreground",
            isCompleted && "border-brand bg-brand text-brand-foreground"
          )}
        >
          {isCompleted ? (
            <CheckIcon className="size-3" strokeWidth={3} />
          ) : null}
        </span>
      </button>

      <button
        type="button"
        data-todo-id={todo._id}
        aria-current={isSelected ? "true" : undefined}
        onClick={() => onSelect(todo)}
        className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-md py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={cn(
            "truncate text-sm font-medium",
            isCompleted && "text-muted-foreground line-through decoration-ring"
          )}
        >
          {todo.text}
        </span>
        {meta.length > 0 ? (
          <span className="truncate text-xs text-muted-foreground">
            {meta.map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 ? " · " : null}
                {part}
              </React.Fragment>
            ))}
          </span>
        ) : null}
      </button>
    </li>
  )
}
