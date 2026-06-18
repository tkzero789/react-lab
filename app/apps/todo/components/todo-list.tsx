"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Link2Icon, MapPinIcon } from "lucide-react"
import Image from "next/image"
import React from "react"
import Loader from "@/components/ui/loader"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { todoQueries } from "@/lib/query-options"
import TodoSheet, { Todo } from "./todo-sheet"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"

function TodoItem({
  todo,
  onSelect,
  selected,
}: {
  todo: Todo
  onSelect: (todo: Todo) => void
  selected: Todo | null
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(todo)}
        className={cn(
          "flex w-full flex-col gap-2 rounded-xl border bg-card p-4 text-left transition-colors hover:border-ring",
          selected?._id === todo._id && "border-ring"
        )}
      >
        <div className="text-sm font-medium">{todo.text}</div>

        {todo.date !== 0 && (
          <div className="flex items-center gap-4 text-sm">
            <CalendarIcon className="size-4 shrink-0" />
            {format(new Date(todo.date), "EEE, MMM d, yyyy")}
          </div>
        )}
        {todo.location && (
          <div className="flex items-center gap-4 text-sm">
            <MapPinIcon className="size-4 shrink-0" /> {todo.location}
          </div>
        )}
        {todo.url && (
          <div className="flex items-center gap-4 text-sm">
            <Link2Icon className="size-4 shrink-0" />{" "}
            <div className="truncate">{todo.url}</div>
          </div>
        )}
        <div className="flex w-full items-center gap-2">
          {todo.imageObject.map((image, index) => {
            return image?.url ? (
              <div
                key={image.storageId}
                className={cn("w-full max-w-16", index > 3 && "hidden")}
              >
                <AspectRatio
                  ratio={1 / 1}
                  className="overflow-hidden rounded-xl border bg-background"
                >
                  <Image
                    src={image.url}
                    alt="Todo image"
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            ) : null
          })}
          {todo.imageObject.length > 4 && (
            <div className="w-full max-w-16">
              <AspectRatio
                ratio={1 / 1}
                className="flex items-center justify-center overflow-hidden rounded-xl border bg-muted"
              >
                +{todo.imageObject.length - 4}
              </AspectRatio>
            </div>
          )}
        </div>
      </button>
    </li>
  )
}

export default function TodoList() {
  const { data: todos, isPending } = useQuery(todoQueries.list())
  const [selected, setSelected] = React.useState<Todo | null>(null)

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
      <TodoSheet
        todo={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </>
  )
}
