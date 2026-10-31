"use client"

/* Todo app with the views on the left, the todo list in the middle, and the selected todo in a side panel on the right */

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  CheckCheckIcon,
  CircleCheckIcon,
  ListTodoIcon,
  MousePointerClickIcon,
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
import ListEmojiPicker from "./list-emoji-picker"
import ListTitle from "./list-title"
import TodoDetail from "./todo-detail"
import TodoList from "./todo-list"
import TodoNav from "./todo-nav"
import TodoNew from "./todo-new"
import TodoSummary from "./todo-summary"
import { Todo } from "../types"
import {
  BuiltInView,
  DEFAULT_VIEW,
  isInView,
  parseView,
  View,
  VIEWS,
} from "../views"

type Tab = "todo" | "completed"

/* The selected todo and the view are in the URL, so a refresh or a shared link opens the same place */
const SELECTED_PARAM = "todo"
const VIEW_PARAM = "view"

/* The new todo form uses the same param, so the panel cannot show a todo and the form at once */
const NEW_TODO = "new"

const NEW_TODO_KEY = "n"

const EMPTY_OPEN: Record<
  BuiltInView | "list",
  { title: string; description: string }
> = {
  today: {
    title: "Nothing due today",
    description: "Todos that are due today or overdue show here.",
  },
  week: {
    title: "Nothing due this week",
    description: "Todos that are due in the next 7 days show here.",
  },
  all: {
    title: "Your list is empty",
    description: "Add your first todo with its date and place.",
  },
  list: {
    title: "This list is empty",
    description: "Add a todo, and it goes into this list.",
  },
}

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

/* The History API updates useSearchParams without a server round trip */
function setParams(changes: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value)
    else params.delete(key)
  }
  const next = params.toString()
  window.history.replaceState(
    null,
    "",
    next ? `?${next}` : window.location.pathname
  )
}

export default function TodoApp() {
  const { data: todos, isPending } = useQuery(todoQueries.list())
  const { data: lists = [], isPending: isListsPending } = useQuery(
    todoQueries.lists()
  )
  const searchParams = useSearchParams()
  const selectedId = searchParams.get(SELECTED_PARAM)
  const isNew = selectedId === NEW_TODO
  const view = parseView(searchParams.get(VIEW_PARAM), lists)
  const activeList = lists.find((list) => list._id === view) ?? null
  const detailRef = React.useRef<HTMLDivElement>(null)

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

  const viewOpen = open.filter((todo) => isInView(todo, view))
  const viewCompleted = completed.filter((todo) => isInView(todo, view))

  const selected = todos?.find((todo) => todo._id === selectedId) ?? null

  function showPanel(id: string, nextView = view) {
    setParams({
      [SELECTED_PARAM]: id,
      [VIEW_PARAM]: nextView === DEFAULT_VIEW ? null : nextView,
    })
    /* A narrow window shows the panel below the list. On a wide window the sticky panel is already in view, so nothing scrolls. */
    requestAnimationFrame(() =>
      detailRef.current?.scrollIntoView({ block: "nearest" })
    )
  }

  function selectView(next: View) {
    setParams({
      [VIEW_PARAM]: next === DEFAULT_VIEW ? null : next,
      /* Keep an unsaved new todo open. Close a todo that can be outside the new view. */
      ...(isNew ? {} : { [SELECTED_PARAM]: null }),
    })
  }

  function openTodo(todo: Todo) {
    showPanel(todo._id)
  }

  function openFromSearch(todo: Todo) {
    setTab(todo.status === "completed" ? "completed" : "todo")
    /* Switch to the view with every todo, so the found todo shows in the list too */
    showPanel(todo._id, isInView(todo, view) ? view : "all")
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
    setParams({ [SELECTED_PARAM]: null })
  }

  function handleAdded(id: string) {
    setParams({ [SELECTED_PARAM]: id })
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

  if (isPending || isListsPending) {
    return <Loader />
  }

  const viewLabel = VIEWS.find((item) => item.id === view)?.label

  function renderList(listTab: Tab) {
    const list = listTab === "todo" ? viewOpen : viewCompleted

    if (list.length > 0) {
      return (
        <TodoList
          todos={list}
          lists={activeList ? [] : lists}
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

    if (viewCompleted.length > 0) {
      return (
        <ListEmpty
          icon={CheckCheckIcon}
          title="All done"
          description="You finished everything here."
        />
      )
    }

    const empty = EMPTY_OPEN[activeList ? "list" : (view as BuiltInView)]
    return (
      <ListEmpty
        icon={ListTodoIcon}
        title={empty.title}
        description={empty.description}
      >
        <Button variant="outline" onClick={startNew}>
          <PlusIcon data-icon="inline-start" />
          New todo
        </Button>
      </ListEmpty>
    )
  }

  return (
    <div className="grid flex-1 grid-cols-1 md:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(20rem,1fr)_minmax(22.5rem,28.75rem)]">
      <div className="border-b md:border-r md:border-b-0">
        <div className="md:sticky md:top-0 md:max-h-svh md:overflow-y-auto">
          <TodoNav
            open={open}
            completed={completed}
            lists={lists}
            view={view}
            onSelectView={selectView}
            onSearchSelect={openFromSearch}
          />
        </div>
      </div>

      <section aria-label="Todos" className="min-w-0">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="gap-4 p-4 md:p-6"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex min-w-0 items-center gap-1">
              {activeList ? (
                <React.Fragment key={activeList._id}>
                  <ListEmojiPicker list={activeList} />
                  <ListTitle list={activeList} />
                </React.Fragment>
              ) : (
                <h1 className="truncate text-xl font-semibold">{viewLabel}</h1>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <TabsList>
                <TabsTrigger value="todo">
                  Todo
                  <span className="text-xs leading-none tabular-nums">
                    {viewOpen.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  <span className="text-xs leading-none tabular-nums">
                    {viewCompleted.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
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

          <TodoSummary open={viewOpen} completed={viewCompleted} />

          <TabsContent value="todo">{renderList("todo")}</TabsContent>
          <TabsContent value="completed">{renderList("completed")}</TabsContent>
        </Tabs>
      </section>

      <section
        aria-label="Todo details"
        className={cn(
          "min-w-0 border-t md:col-span-2 xl:col-span-1 xl:border-t-0 xl:border-l",
          /* Below the list, an empty panel only adds scroll */
          !selected && !isNew && "hidden xl:block"
        )}
      >
        <div
          ref={detailRef}
          className="mx-auto max-w-2xl xl:sticky xl:top-0 xl:h-full xl:max-h-svh xl:overflow-y-auto"
        >
          {isNew ? (
            <TodoNew
              lists={lists}
              defaultListId={activeList?._id ?? null}
              onAdded={handleAdded}
              onClose={closeDetail}
            />
          ) : selected ? (
            <TodoDetail
              key={selected._id}
              todo={selected}
              lists={lists}
              onClose={closeDetail}
              onToggle={toggleStatus}
            />
          ) : (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MousePointerClickIcon />
                </EmptyMedia>
                <EmptyTitle>No todo selected</EmptyTitle>
                <EmptyDescription>
                  Select a todo to see its details.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  Press <Kbd>N</Kbd> to add a todo
                </p>
              </EmptyContent>
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
