"use client"

/* Side panel form that adds a todo */

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { startOfDay } from "date-fns"
import { MapPinIcon } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/lib/toast"
import TodoDateField from "./todo-date-field"
import TodoOverviewButton from "./todo-overview-button"

type Props = {
  onAdded: (id: Id<"todos">) => void
  onClose: () => void
}

export default function TodoNew({ onAdded, onClose }: Props) {
  const id = React.useId()
  const [text, setText] = React.useState("")
  const [date, setDate] = React.useState(() => startOfDay(new Date()).getTime())
  const [location, setLocation] = React.useState("")

  const { mutate: addTodo, isPending } = useMutation({
    mutationFn: useConvexMutation(api.todos.add),
    onSuccess: onAdded,
    onError: (error) => toast.error(error.message),
  })

  const canSubmit = text.trim() !== "" && !isPending

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    addTodo({ text: text.trim(), date, location: location.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">New todo</h2>
        <TodoOverviewButton onClick={onClose} className="ml-auto" />
      </div>

      <div>
        <label htmlFor={`${id}-title`} className="sr-only">
          Task
        </label>
        <textarea
          id={`${id}-title`}
          rows={1}
          autoFocus
          placeholder="What do you need to do?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
          className="-mx-2.5 field-sizing-content w-[calc(100%+1.25rem)] resize-none rounded-md bg-transparent px-2.5 py-1.5 text-xl leading-snug font-medium outline-none placeholder:text-muted-foreground hover:bg-button-ghost-hover focus-visible:bg-input focus-visible:ring-1 focus-visible:ring-ring active:bg-button-ghost-hover"
        />
      </div>

      <dl className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-4 gap-y-6">
        <dt className="pt-2.5 text-sm text-muted-foreground">
          <label htmlFor={`${id}-date`}>Due date</label>
        </dt>
        <dd>
          <TodoDateField id={`${id}-date`} value={date} onChange={setDate} />
        </dd>

        <dt className="pt-2.5 text-sm text-muted-foreground">
          <label htmlFor={`${id}-location`}>Location</label>
        </dt>
        <dd>
          <InputGroup>
            <InputGroupAddon>
              <MapPinIcon />
            </InputGroupAddon>
            <InputGroupInput
              id={`${id}-location`}
              placeholder="Add a place"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </dd>
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
        <span className="text-xs text-muted-foreground">
          Add files after you create the todo.
        </span>
        <Button type="submit" size="sm" disabled={!canSubmit}>
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Add todo
        </Button>
      </div>
    </form>
  )
}
