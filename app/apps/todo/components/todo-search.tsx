"use client"

/* Search button and command palette that open any todo in the side panel */

import { defaultFilter } from "cmdk"
import { CircleCheckIcon, CircleIcon, SearchIcon } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useIsMac } from "@/hooks/use-is-mac"
import { getDateInfo } from "../dates"
import { Todo } from "../types"
import { Input } from "@/components/ui/input"

type Props = {
  open: Todo[]
  completed: Todo[]
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSelect: (todo: Todo) => void
}

/* Each item value is the todo ID, because two todos can have the same text. Match on the keywords only. */
function filter(_value: string, search: string, keywords?: string[]) {
  return defaultFilter(keywords?.join(" ") ?? "", search)
}

export function TodoSearchButton({ onClick }: { onClick: () => void }) {
  const isMac = useIsMac()

  return (
    <Button
      variant="input"
      aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
      onClick={onClick}
      className="w-full"
    >
      <SearchIcon />
      <span className="text-muted-foreground">Search...</span>
      <KbdGroup className="ml-auto">
        <Kbd className="bg-kbd-tooltip">{isMac ? "⌘ + K" : "Ctrl + K"}</Kbd>
      </KbdGroup>
    </Button>
  )
}

/* The parent keeps this mounted, because the search button can be inside a closed sheet and the shortcut must still work */
export default function TodoSearch({
  open,
  completed,
  isOpen,
  onOpenChange,
  onSelect,
}: Props) {
  /* An Effect Event reads the latest isOpen, so the listener subscribes once */
  const onShortcut = React.useEffectEvent(() => onOpenChange(!isOpen))

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onShortcut()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function select(todo: Todo) {
    onOpenChange(false)
    onSelect(todo)
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Search todos"
      description="Find a todo by its text or location."
    >
      <Command filter={filter}>
        <CommandInput placeholder="Search todos" />
        <CommandList>
          <CommandEmpty>No todos found.</CommandEmpty>
          {open.length > 0 ? (
            <CommandGroup heading="Todo">
              {open.map((todo) => (
                <SearchItem key={todo._id} todo={todo} onSelect={select} />
              ))}
            </CommandGroup>
          ) : null}
          {completed.length > 0 ? (
            <CommandGroup heading="Completed">
              {completed.map((todo) => (
                <SearchItem key={todo._id} todo={todo} onSelect={select} />
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

function SearchItem({
  todo,
  onSelect,
}: {
  todo: Todo
  onSelect: (todo: Todo) => void
}) {
  const isCompleted = todo.status === "completed"
  const meta = [
    isCompleted ? null : getDateInfo(todo.date)?.label,
    todo.location,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <CommandItem
      value={todo._id}
      keywords={[todo.text, todo.location]}
      onSelect={() => onSelect(todo)}
    >
      {isCompleted ? (
        <CircleCheckIcon className="text-muted-foreground" />
      ) : (
        <CircleIcon className="text-muted-foreground" />
      )}
      <span className="min-w-0 flex-1 truncate">{todo.text}</span>
      {meta ? (
        <span className="max-w-40 shrink-0 truncate text-xs text-muted-foreground">
          {meta}
        </span>
      ) : null}
    </CommandItem>
  )
}
