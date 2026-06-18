"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns"
import { CalendarIcon, EllipsisIcon, Link2Icon, MapPinIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import type { FunctionReturnType } from "convex/server"
import TodoForm from "./todo-form"

type Todo = FunctionReturnType<typeof api.todos.list>[number]

function TodoItem({
  todo,
  onRemove,
}: {
  todo: Todo
  onRemove: (id: Id<"todos">) => void
}) {
  const [editOpen, setEditOpen] = React.useState(false)

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="flex w-full flex-col gap-2">
        {/* Name and actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium">{todo.text}</div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <EllipsisIcon />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onRemove(todo._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {todo.imageObject?.url && (
          <div className="w-fit rounded-xl border bg-background">
            <Image
              src={todo.imageObject.url}
              alt="Todo image"
              width={60}
              height={60}
            />
          </div>
        )}

        {/* Date */}
        {todo.date !== 0 ? (
          <div className="flex items-center gap-4 text-sm">
            <CalendarIcon className="size-4" />{" "}
            {format(new Date(todo.date), "EEE, MMM d, yyyy")}
          </div>
        ) : null}
        {/* Location */}
        {todo.location && (
          <div className="flex items-center gap-4 text-sm">
            <MapPinIcon className="size-4" /> {todo.location}
          </div>
        )}
        {/* Url */}
        {todo.url && (
          <Link
            href={todo.url}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-fit w-fit gap-4 px-0 font-normal"
            )}
          >
            <Link2Icon />
            {todo.url}
          </Link>
        )}
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit todo</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <TodoForm todo={todo} onSuccess={() => setEditOpen(false)} />
          </DialogBody>
          <DialogFooter>
            <Button form="updateTodo" type="submit" className="w-full">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  )
}

export default function TodoList() {
  const todos = useQuery(api.todos.list)
  const removeTodo = useMutation(api.todos.remove)

  async function handleRemoveTodo(todoId: Id<"todos">) {
    await removeTodo({ id: todoId })
  }

  return (
    <ul className="flex flex-1 flex-col gap-2">
      {todos?.map((todo) => (
        <TodoItem key={todo._id} todo={todo} onRemove={handleRemoveTodo} />
      ))}
    </ul>
  )
}
