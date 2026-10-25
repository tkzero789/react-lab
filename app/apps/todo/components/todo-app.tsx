"use client"

/* Todo app with the list on the left and the selected todo in a side panel on the right */

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  CheckCheckIcon,
  CircleCheckIcon,
  ListTodoIcon,
  PlusIcon,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Loader from "@/components/ui/loader"
import { Kbd } from "@/components/ui/kbd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { todoQueries } from "@/lib/query-options"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import TodoDetail from "./todo-detail"
import TodoList from "./todo-list"
import TodoNew from "./todo-new"
import TodoSearch from "./todo-search"
import { Todo } from "../types"

type Tab = "todo" | "completed"

/* The selected todo is in the URL, so a refresh or a shared link opens the same todo */
const SELECTED_PARAM = "todo"

/* The new todo form uses the same param, so the panel cannot show a todo and the form at once */
const NEW_TODO = "new"

const NEW_TODO_KEY = "n"

/* A letter key must still type text and must not act behind an open dialog */
function ignoresShortcut(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
      target.closest('[role="dialog"], [role="alertdialog"]') !== null)
  )
}

function focusRow(id: string) {
  document.querySelector<HTMLElement>(`[data-todo-id="${id}"]`)?.focus()
}

export default function TodoApp() {
  const { data: todos, isPending } = useQuery(todoQueries.list())
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_PARAM)
  const isNew = selectedId === NEW_TODO
  const detailRef = React.useRef<HTMLDivElement>(null)
  const addButtonRef = React.useRef<HTMLButtonElement>(null)

  const [tab, setTab] = React.useState<Tab>("todo")

  const { mutate: setStatus } = useMutation({
    mutationFn: useConvexMutation(api.todos.setStatus),
    onError: (error) => toast.error(error.message),
  })

  const { open, completed } = React.useMemo(() => {
    const open: Todo[] = []
    const completed: Todo[] = []

    for (const todo of todos ?? []) {
      if (todo.status === "completed") completed.push(todo)
      else open.push(todo)
    }

    open.sort((a, b) => a.date - b.date)
    completed.sort((a, b) => b.date - a.date)

    return { open, completed }
  }, [todos])

  const selected = todos?.find((todo) => todo._id === selectedId) ?? null

  function select(id: string | null) {
    const params = new URLSearchParams(window.location.search)
    if (id) params.set(SELECTED_PARAM, id)
    else params.delete(SELECTED_PARAM)
    const next = params.toString()
    /* The History API updates useSearchParams without a server round trip */
    window.history.replaceState(
      null,
      "",
      next ? `?${next}` : window.location.pathname
    )
  }

  function showPanel(id: string) {
    select(id)
    /* A narrow window shows the panel below the list. On desktop the sticky panel is already in view, so nothing scrolls. */
    requestAnimationFrame(() =>
      detailRef.current?.scrollIntoView({ block: "nearest" })
    )
  }

  function openTodo(todo: Todo) {
    showPanel(todo._id)
  }

  function openFromSearch(todo: Todo) {
    setTab(todo.status === "completed" ? "completed" : "todo")
    showPanel(todo._id)
  }

  function startNew() {
    setTab("todo")
    showPanel(NEW_TODO)
  }

  /* An Effect Event reads the latest startNew, so the listener subscribes once */
  const onNewKey = React.useEffectEvent(startNew)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== NEW_TODO_KEY ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.defaultPrevented ||
        ignoresShortcut(event.target)
      ) {
        return
      }
      event.preventDefault()
      onNewKey()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function closeDetail() {
    const id = selectedId
    select(null)
    /* Give focus back to the control that opened the panel, so the keyboard user keeps their place */
    if (id === NEW_TODO) {
      addButtonRef.current?.focus()
    } else if (id) {
      focusRow(id)
    }
  }

  function handleAdded(id: string) {
    select(id)
    /* The form unmounts, so move focus to the new row instead of the page body */
    requestAnimationFrame(() => focusRow(id))
  }

  function toggleStatus(todo: Todo) {
    const status = todo.status === "completed" ? "todo" : "completed"
    setStatus({ id: todo._id, status })

    if (status === "completed") {
      toast(`Completed “${todo.text}”`, {
        actionProps: {
          children: "Undo",
          onClick: () => setStatus({ id: todo._id, status: "todo" }),
        },
      })
    }
  }

  if (isPending) {
    return <Loader />
  }

  function renderList(listTab: Tab) {
    const list = listTab === "todo" ? open : completed

    if (list.length > 0) {
      return (
        <TodoList
          todos={list}
          grouped={listTab === "todo"}
          selectedId={selectedId}
          onSelect={openTodo}
          onToggle={toggleStatus}
        />
      )
    }

    if (listTab === "completed") {
      return (
        <ListEmpty
          icon={CircleCheckIcon}
          title="Nothing completed yet"
          description="Check off a todo and it moves here."
        />
      )
    }

    return completed.length > 0 ? (
      <ListEmpty
        icon={CheckCheckIcon}
        title="All done"
        description="You finished everything on your list."
      />
    ) : (
      <ListEmpty
        icon={ListTodoIcon}
        title="Your list is empty"
        description="Add your first todo with its date and place."
      >
        <Button variant="outline" onClick={startNew}>
          <PlusIcon data-icon="inline-start" />
          New todo
        </Button>
      </ListEmpty>
    )
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <section
        aria-label="Todos"
        className="flex flex-col md:w-96 md:shrink-0 md:border-r lg:w-md"
      >
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="gap-3 p-4"
        >
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="todo">
                Todo
                <span className="text-xs tabular-nums">{open.length}</span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <span className="text-xs tabular-nums">{completed.length}</span>
              </TabsTrigger>
            </TabsList>

            <div className="ml-auto flex items-center gap-1">
              <TodoSearch
                open={open}
                completed={completed}
                onSelect={openFromSearch}
              />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      ref={addButtonRef}
                      variant={isNew ? "muted" : "ghost"}
                      size="icon"
                      aria-label="New todo"
                      aria-keyshortcuts="N"
                      onClick={startNew}
                    />
                  }
                >
                  <PlusIcon />
                </TooltipTrigger>
                <TooltipContent>
                  New todo
                  <Kbd>N</Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <TabsContent value="todo">{renderList("todo")}</TabsContent>
          <TabsContent value="completed">{renderList("completed")}</TabsContent>
        </Tabs>
      </section>

      <section
        aria-label="Todo details"
        onKeyDown={(e) => {
          /* Ignore keys from portals, such as the date popover, which bubble here through React */
          if (
            e.key === "Escape" &&
            e.currentTarget.contains(e.target as Node)
          ) {
            closeDetail()
          }
        }}
        className={cn(
          "min-w-0 flex-1 border-t bg-panel md:border-t-0",
          !selected && !isNew && "hidden md:block"
        )}
      >
        <div
          ref={detailRef}
          className="md:sticky md:top-0 md:max-h-svh md:overflow-y-auto"
        >
          {isNew ? (
            <div className="mx-auto max-w-2xl">
              <TodoNew onAdded={handleAdded} onClose={closeDetail} />
            </div>
          ) : selected ? (
            <div className="mx-auto max-w-2xl">
              <TodoDetail
                key={selected._id}
                todo={selected}
                onClose={closeDetail}
                onToggle={toggleStatus}
              />
            </div>
          ) : (
            <Empty className="min-h-96">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>Nothing selected</EmptyTitle>
                <EmptyDescription>
                  Select a todo to see and edit its date, place, and files.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </section>
    </div>
  )
}

function ListEmpty({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <Empty className="p-6 md:p-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? (
        <EmptyContent className="flex-row flex-wrap justify-center">
          {children}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
