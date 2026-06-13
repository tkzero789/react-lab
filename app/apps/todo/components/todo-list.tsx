"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import {
  CalendarIcon,
  Link2Icon,
  MapPinIcon,
  Pencil,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import TodoForm from "./todo-form"
import { format } from "date-fns"

export default function TodoList() {
  const todos = useQuery(api.todos.list)
  const removeTodo = useMutation(api.todos.remove)

  async function handleRemoveTodo(todoId: Id<"todos">) {
    await removeTodo({ id: todoId })
  }

  return (
    <ul className="flex flex-1 flex-col gap-2">
      {todos?.map((todo) => (
        <li
          key={todo._id}
          className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
        >
          <div className="flex w-full flex-col gap-2">
            {/* Name and Edit */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium">{todo.text}</div>
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:bg-muted-foreground/15"
                      >
                        <Pencil />
                      </Button>
                    }
                  ></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit todo</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <TodoForm todo={todo} />
                    </DialogBody>
                    <DialogFooter>
                      <Button form="todoForm" type="submit" className="w-full">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost-destructive"
                  size="icon-sm"
                  onClick={() => handleRemoveTodo(todo._id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            {/* Date */}
            {todo.date && (
              <div className="flex items-center gap-4 text-sm">
                <CalendarIcon className="size-4" />{" "}
                {format(new Date(todo.date), "EEE, MMM d, yyyy")}
              </div>
            )}
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
        </li>
      ))}
    </ul>
  )
}
