"use client"

/* Left panel of the todo app with search, the date views, and the user's lists */

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { EllipsisIcon, PlusIcon } from "lucide-react"
import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { MAX_LISTS } from "@/types/todo"
import ListEmoji from "./list-emoji"
import { ListEmojiPopover } from "./list-emoji-picker"
import ListNameInput, { restoreFocus } from "./list-name-input"
import { TodoSearchButton } from "./todo-search"
import { List, Todo } from "../types"
import { DEFAULT_VIEW, isInView, View, VIEWS } from "../views"

type Props = {
  open: Todo[]
  completed: Todo[]
  lists: List[]
  view: View
  onSelectView: (view: View) => void
  onSearchOpen: () => void
}

const NAV_ITEM_CLASS =
  "w-full min-w-0 justify-start font-normal aria-[current=page]:font-medium [&_svg]:text-muted-foreground"

export default function TodoNav({
  open,
  completed,
  lists,
  view,
  onSelectView,
  onSearchOpen,
}: Props) {
  const id = React.useId()
  const [isCreating, setIsCreating] = React.useState(false)

  const { mutate: createList } = useMutation({
    mutationFn: useConvexMutation(api.todoLists.create),
    onSuccess: (listId: Id<"todoLists">) => {
      onSelectView(listId)
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>(`[data-list-id="${listId}"]`)
          ?.focus()
      )
    },
    onError: (error) => toast.error(error.message),
  })

  const countOf = (target: View) =>
    open.filter((todo) => isInView(todo, target)).length

  return (
    <nav aria-label="Todo views" className="flex flex-col gap-5 p-3">
      <TodoSearchButton onClick={onSearchOpen} />

      <ul className="flex flex-col gap-0.5">
        {VIEWS.map(({ id: viewId, label, icon: Icon }) => (
          <li key={viewId}>
            <Button
              variant={view === viewId ? "muted" : "ghost"}
              aria-current={view === viewId ? "page" : undefined}
              onClick={() => onSelectView(viewId)}
              className={NAV_ITEM_CLASS}
            >
              <Icon />
              {label}
              <Count value={countOf(viewId)} />
            </Button>
          </li>
        ))}
      </ul>

      <section aria-labelledby={`${id}-lists`} className="flex flex-col gap-1">
        <div className="group/lists-header flex items-center justify-between pr-1 pl-2">
          <h2
            id={`${id}-lists`}
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Lists
          </h2>
          {lists.length < MAX_LISTS ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    id={`${id}-new-list`}
                    variant="ghost"
                    size="icon-xs"
                    aria-label="New list"
                    onClick={() => setIsCreating(true)}
                    className={cn(
                      "text-muted-foreground opacity-0 transition-opacity group-hover/lists-header:opacity-100 focus-visible:opacity-100",
                      /* An empty section has no other way to start, so the button always shows */
                      lists.length === 0 && "opacity-100"
                    )}
                  />
                }
              >
                <PlusIcon />
              </TooltipTrigger>
              <TooltipContent>New list</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        {lists.length > 0 ? (
          <ul className="flex flex-col gap-0.5">
            {lists.map((list) => (
              <ListRow
                key={list._id}
                list={list}
                isActive={view === list._id}
                openCount={countOf(list._id)}
                todoCount={
                  open.filter((todo) => todo.listId === list._id).length +
                  completed.filter((todo) => todo.listId === list._id).length
                }
                onSelect={() => onSelectView(list._id)}
                onRemoved={() => {
                  if (view === list._id) onSelectView(DEFAULT_VIEW)
                }}
              />
            ))}
          </ul>
        ) : null}
        {isCreating ? (
          <ListNameInput
            label="New list name"
            onSubmit={(name) => createList({ name })}
            onClose={() => {
              setIsCreating(false)
              restoreFocus(`#${CSS.escape(`${id}-new-list`)}`)
            }}
          />
        ) : null}
      </section>
    </nav>
  )
}

function Count({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "ml-auto text-xs leading-none font-normal text-muted-foreground tabular-nums",
        className
      )}
    >
      {value > 0 ? value : null}
    </span>
  )
}

function ListRow({
  list,
  isActive,
  openCount,
  todoCount,
  onSelect,
  onRemoved,
}: {
  list: List
  isActive: boolean
  openCount: number
  todoCount: number
  onSelect: () => void
  onRemoved: () => void
}) {
  const rowRef = React.useRef<HTMLLIElement>(null)
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [isEmojiOpen, setIsEmojiOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const { mutate: renameList } = useMutation({
    mutationFn: useConvexMutation(api.todoLists.rename),
    onError: (error) => toast.error(error.message),
  })

  const { mutate: removeList, isPending: isRemoving } = useMutation({
    mutationFn: useConvexMutation(api.todoLists.remove),
    onSuccess: () => {
      setIsDeleteOpen(false)
      onRemoved()
    },
    onError: (error) => toast.error(error.message),
  })

  if (isRenaming) {
    return (
      <li>
        <ListNameInput
          label="List name"
          defaultValue={list.name}
          onSubmit={(name) => renameList({ id: list._id, name })}
          onClose={() => {
            setIsRenaming(false)
            restoreFocus(`[data-list-id="${list._id}"]`)
          }}
        />
      </li>
    )
  }

  return (
    <li ref={rowRef} className="group/list relative">
      <Button
        variant={isActive ? "muted" : "ghost"}
        data-list-id={list._id}
        aria-current={isActive ? "page" : undefined}
        onClick={onSelect}
        className={cn(
          NAV_ITEM_CLASS,
          "pr-9",
          isActive
            ? "group-hover/list:bg-button-muted-hover group-active/list:bg-button-muted-hover group-has-data-popup-open/list:bg-button-muted-hover"
            : "group-hover/list:bg-button-ghost-hover group-active/list:bg-button-ghost-hover group-has-data-popup-open/list:bg-button-ghost-hover"
        )}
      >
        <ListEmoji emoji={list.emoji} className="w-5 text-center text-base" />
        <span className="truncate">{list.name}</span>
        {/* The actions button covers the count when it shows */}
        <Count
          value={openCount}
          className="transition-opacity group-focus-within/list:opacity-0 group-hover/list:opacity-0 group-has-data-popup-open/list:opacity-0"
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant={isActive ? "ghost" : "muted"}
              size="icon-xs"
              aria-label={`${list.name} actions`}
              className="absolute top-1 right-1 bg-transparent opacity-0 transition-opacity group-focus-within/list:opacity-100 group-hover/list:opacity-100 data-popup-open:opacity-100"
            >
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEmojiOpen(true)}>
              Change emoji
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListEmojiPopover
        list={list}
        open={isEmojiOpen}
        onOpenChange={setIsEmojiOpen}
        anchor={rowRef}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {list.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {todoCount === 0
                ? "This list has no todos."
                : `Its ${todoCount === 1 ? "todo stays" : `${todoCount} todos stay`}, but without a list.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isRemoving}
              onClick={() => removeList({ id: list._id })}
            >
              {isRemoving ? <Spinner /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  )
}
