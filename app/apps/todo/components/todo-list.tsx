"use client"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { groupByDate } from "../dates"
import TodoItem from "./todo-item"
import { Todo } from "../types"

type Props = {
  todos: Todo[]
  /** Completed todos are a flat list — due-date grouping is meaningless there. */
  grouped?: boolean
  onEdit: (todo: Todo) => void
  onToggle: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export default function TodoList({ todos, grouped = true, ...actions }: Props) {
  if (!grouped) {
    return <Rows todos={todos} {...actions} />
  }

  return (
    <div className="flex flex-col gap-6">
      {groupByDate(todos).map((group) => (
        <section key={group.id} className="flex flex-col gap-2">
          <div
            className={cn(
              "flex items-center gap-2 px-3 text-xs tracking-wide text-muted-foreground uppercase",
              group.id === "overdue" && "text-destructive"
            )}
          >
            <h3 className="font-semibold">{group.label}</h3>
            <span className="font-medium tabular-nums opacity-75">
              {group.todos.length}
            </span>
            <Separator className="flex-1" />
          </div>
          <Rows todos={group.todos} {...actions} />
        </section>
      ))}
    </div>
  )
}

function Rows({ todos, ...actions }: Omit<Props, "grouped">) {
  return (
    <ul className="flex flex-col gap-1">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} {...actions} />
      ))}
    </ul>
  )
}
