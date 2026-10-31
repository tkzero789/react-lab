"use client"

/* Todo rows for the list pane, grouped by due date. Arrow keys move the selection. */

import React from "react"
import { cn } from "@/lib/utils"
import { groupByDate } from "../dates"
import TodoItem from "./todo-item"
import { List, Todo } from "../types"

type Props = {
  todos: Todo[]
  /* The lists to name on each row. Leave it empty when every row is in the same list. */
  lists: List[]
  /* Due-date groups do not help in the completed list */
  grouped?: boolean
  /* A sheet takes focus when it opens, so arrow keys select a row only when the panel is a column */
  selectOnArrow: boolean
  selectedId: string | null
  onSelect: (todo: Todo) => void
  onToggle: (todo: Todo) => void
}

export default function TodoList({
  todos,
  lists,
  grouped = true,
  selectOnArrow,
  selectedId,
  onSelect,
  onToggle,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return

    const rows = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-todo-id]")
    )
    const index = rows.findIndex((row) => row === document.activeElement)
    if (index === -1) return

    e.preventDefault()
    const next = rows[index + (e.key === "ArrowDown" ? 1 : -1)]
    const todo = todos.find((item) => item._id === next?.dataset.todoId)
    if (!next || !todo) return

    next.focus()
    if (selectOnArrow) onSelect(todo)
  }

  const rowProps = { lists, selectedId, onSelect, onToggle }

  return (
    <div onKeyDown={handleKeyDown}>
      {grouped ? (
        <div className="flex flex-col gap-4">
          {groupByDate(todos).map((group) => (
            <section key={group.id} className="flex flex-col gap-0.5">
              <h3
                className={cn(
                  "flex items-center gap-2 px-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                  group.id === "overdue" && "text-destructive"
                )}
              >
                {group.label}
                <span className="leading-none font-medium tabular-nums">
                  {group.todos.length}
                </span>
              </h3>
              <Rows todos={group.todos} {...rowProps} />
            </section>
          ))}
        </div>
      ) : (
        <Rows todos={todos} {...rowProps} />
      )}
    </div>
  )
}

function Rows({
  todos,
  lists,
  selectedId,
  onSelect,
  onToggle,
}: Omit<Props, "grouped" | "selectOnArrow">) {
  return (
    <ul className="flex flex-col gap-0.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          list={lists.find((list) => list._id === todo.listId)}
          isSelected={todo._id === selectedId}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}
