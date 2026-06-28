"use client"

import { useQuery } from "@tanstack/react-query"
import React from "react"
import Loader from "@/components/ui/loader"
import { todoQueries } from "@/lib/query-options"
import TodoDialog from "./todo-dialog"
import { Todo } from "../page"
import TodoItem from "./todo-item"

export default function TodoList() {
  const { data: todos, isPending } = useQuery(todoQueries.list())
  const [selected, setSelected] = React.useState<Todo | null>(null)
  const [isDelete, setIsDelete] = React.useState<boolean>(false)

  if (isPending) {
    return <Loader />
  }

  return (
    <>
      <ul className="grid flex-1 grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-3">
        {todos?.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onSelect={setSelected}
            selected={selected}
          />
        ))}
      </ul>
      <TodoDialog
        todo={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        isDelete={isDelete}
        onDeleteChange={setIsDelete}
      />
    </>
  )
}
