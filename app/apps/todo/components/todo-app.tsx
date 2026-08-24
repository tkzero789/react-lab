"use client"

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import React from "react"
import { toast } from "@/lib/toast"
import {
  CheckCheckIcon,
  CircleCheckIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import Loader from "@/components/ui/loader"
import { Spinner } from "@/components/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsListWrapper,
  TabsTrigger,
} from "@/components/ui/tabs"
import { todoQueries } from "@/lib/query-options"
import TodoDialog from "./todo-dialog"
import TodoList from "./todo-list"
import { Todo } from "../types"

function matchesQuery(todo: Todo, query: string) {
  return (
    todo.text.toLowerCase().includes(query) ||
    todo.location.toLowerCase().includes(query)
  )
}

export default function TodoApp() {
  const { data: todos, isPending } = useQuery(todoQueries.list())

  const [search, setSearch] = React.useState<string>("")
  const [editing, setEditing] = React.useState<Todo | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false)
  const [pendingDelete, setPendingDelete] = React.useState<Todo | null>(null)

  const { mutate: setStatus } = useMutation({
    mutationFn: useConvexMutation(api.todos.setStatus),
    onError: (error) => toast.error(error.message),
  })

  const { mutate: removeTodo, isPending: isDeleting } = useMutation({
    mutationFn: useConvexMutation(api.todos.remove),
    onSuccess: () => setPendingDelete(null),
    onError: (error) => toast.error(error.message),
  })

  const query = search.trim().toLowerCase()

  // One pass: tab counts stay unfiltered while the lists honour the search.
  const { open, completed, openCount, completedCount } = React.useMemo(() => {
    const open: Todo[] = []
    const completed: Todo[] = []
    let openCount = 0
    let completedCount = 0

    for (const todo of todos ?? []) {
      const isCompleted = todo.status === "completed"
      if (isCompleted) completedCount++
      else openCount++

      if (query && !matchesQuery(todo, query)) continue
      if (isCompleted) completed.push(todo)
      else open.push(todo)
    }

    open.sort((a, b) => a.date - b.date)
    completed.sort((a, b) => b.date - a.date)

    return { open, completed, openCount, completedCount }
  }, [todos, query])

  function openAddDialog() {
    setEditing(null)
    setIsFormOpen(true)
  }

  function openEditDialog(todo: Todo) {
    setEditing(todo)
    setIsFormOpen(true)
  }

  function toggleStatus(todo: Todo) {
    setStatus({
      id: todo._id,
      status: todo.status === "completed" ? "todo" : "completed",
    })
  }

  const actions = {
    onEdit: openEditDialog,
    onToggle: toggleStatus,
    onDelete: setPendingDelete,
  }

  if (isPending) {
    return <Loader />
  }

  return (
    <Tabs defaultValue="todo" className="flex-1">
      <TabsListWrapper className="flex-wrap justify-between gap-2 px-4 pt-4">
        <TabsList>
          <TabsTrigger value="todo" className="flex-1">
            Todo
            <span className="text-xs tabular-nums opacity-60">{openCount}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed
            <span className="text-xs tabular-nums opacity-60">
              {completedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <InputGroup className="w-44">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search todos"
              aria-label="Search todos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>

          <Button onClick={openAddDialog}>
            <PlusIcon data-icon="inline-start" />
            Add Todo
          </Button>
        </div>
      </TabsListWrapper>

      <TabsContent value="todo" className="px-1 pb-4">
        {open.length > 0 ? (
          <TodoList todos={open} {...actions} />
        ) : query ? (
          <NoMatches query={search} onClear={() => setSearch("")} />
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckCheckIcon />
              </EmptyMedia>
              <EmptyTitle>All clear</EmptyTitle>
              <EmptyDescription>
                Add and manage your todos in one place.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={openAddDialog}>
                <PlusIcon data-icon="inline-start" />
                Add Todo
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </TabsContent>

      <TabsContent value="completed" className="px-1 pb-4">
        {completed.length > 0 ? (
          <TodoList todos={completed} grouped={false} {...actions} />
        ) : query ? (
          <NoMatches query={search} onClear={() => setSearch("")} />
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheckIcon />
              </EmptyMedia>
              <EmptyTitle>Nothing completed yet</EmptyTitle>
              <EmptyDescription>
                Check a todo off and it lands here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </TabsContent>

      <TodoDialog
        todo={editing}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onRequestDelete={setPendingDelete}
      />

      <Dialog
        type="alert"
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogDescription>
              Delete “{pendingDelete?.text}” from your list?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (pendingDelete) removeTodo({ id: pendingDelete._id })
              }}
            >
              {isDeleting ? <Spinner /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}

function NoMatches({
  query,
  onClear,
}: {
  query: string
  onClear: () => void
}) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No matches</EmptyTitle>
        <EmptyDescription>Nothing here matches “{query}”.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onClear}>
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  )
}
