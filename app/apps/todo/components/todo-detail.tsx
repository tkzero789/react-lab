"use client"

/* Side panel that edits one todo. Each change saves at once, so the panel has no Save button. */

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CircleCheckIcon, RotateCcwIcon, Trash2Icon, XIcon } from "lucide-react"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/lib/toast"
import TodoAttachments from "./todo-attachments"
import TodoDateField from "./todo-date-field"
import TodoListField from "./todo-list-field"
import TodoLocationField from "./todo-location-field"
import { Coordinates } from "../places"
import { List, Todo } from "../types"

type TodoPatch = {
  text?: string
  note?: string
  date?: number
  location?: string
  coordinates?: Coordinates | null
  image?: Id<"_storage">[]
  listId?: Id<"todoLists"> | null
}

type Props = {
  todo: Todo
  lists: List[]
  onClose: () => void
  onToggle: (todo: Todo) => void
}

export default function TodoDetail({ todo, lists, onClose, onToggle }: Props) {
  const id = React.useId()
  const isCompleted = todo.status === "completed"
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const updateTodo = useConvexMutation(api.todos.update)
  const {
    mutate: save,
    isPending: isSaving,
    variables,
  } = useMutation({
    mutationFn: (patch: TodoPatch) => updateTodo({ id: todo._id, ...patch }),
    onError: (error) => toast.error(error.message),
  })

  const { mutate: removeTodo, isPending: isDeleting } = useMutation({
    mutationFn: useConvexMutation(api.todos.remove),
    onSuccess: () => {
      setIsDeleteOpen(false)
      onClose()
    },
    onError: (error) => toast.error(error.message),
  })

  /* Show the new date and list at once. The live query catches up a moment later. */
  const date =
    isSaving && variables?.date !== undefined ? variables.date : todo.date
  const listId =
    isSaving && variables?.listId !== undefined
      ? variables.listId
      : (todo.listId ?? null)

  const titleField = useCommitOnBlur(todo.text, (next) => {
    const text = next.trim()
    if (!text || text === todo.text) return false
    save({ text })
  })

  const noteField = useCommitOnBlur(
    todo.note ?? "",
    (next) => {
      const note = next.trim()
      if (note === (todo.note ?? "")) return false
      save({ note })
    },
    { multiline: true }
  )

  const fileCount = todo.imageObject.filter(Boolean).length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onToggle(todo)}>
          {isCompleted ? (
            <RotateCcwIcon data-icon="inline-start" />
          ) : (
            <CircleCheckIcon data-icon="inline-start" />
          )}
          {isCompleted ? "Reopen" : "Mark complete"}
        </Button>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost-destructive"
                size="icon-sm"
                aria-label="Delete todo"
                onClick={() => setIsDeleteOpen(true)}
              />
            }
          >
            <Trash2Icon />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close"
                onClick={onClose}
              />
            }
          >
            <XIcon />
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>

      <div>
        <label htmlFor={`${id}-title`} className="sr-only">
          Task
        </label>
        <textarea
          id={`${id}-title`}
          rows={1}
          {...titleField}
          className="-mx-2.5 field-sizing-content w-[calc(100%+1.25rem)] resize-none rounded-md bg-transparent px-2.5 py-1.5 text-xl leading-snug font-medium outline-none hover:bg-button-ghost-hover focus-visible:bg-input focus-visible:ring-1 focus-visible:ring-ring active:bg-button-ghost-hover"
        />
      </div>

      <dl className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-4 gap-y-6">
        <dt className="pt-2.5 text-sm text-muted-foreground">
          <label htmlFor={`${id}-date`}>Date</label>
        </dt>
        <dd>
          <TodoDateField
            id={`${id}-date`}
            value={date}
            onChange={(next) => save({ date: next })}
          />
        </dd>

        <dt id={`${id}-list`} className="pt-1.5 text-sm text-muted-foreground">
          List
        </dt>
        <dd>
          <TodoListField
            labelId={`${id}-list`}
            lists={lists}
            value={listId}
            onChange={(next) => save({ listId: next })}
          />
        </dd>

        <dt className="pt-2.5 text-sm text-muted-foreground">
          <label htmlFor={`${id}-location`}>Location</label>
        </dt>
        <dd>
          <TodoLocationField
            id={`${id}-location`}
            value={{
              location: todo.location,
              coordinates: todo.coordinates ?? null,
            }}
            onChange={(next) => save(next)}
          />
        </dd>

        <dt className="pt-2 text-sm text-muted-foreground">
          <label htmlFor={`${id}-note`}>Note</label>
        </dt>
        <dd>
          <Textarea
            id={`${id}-note`}
            placeholder="Add a note"
            {...noteField}
            className="resize-none"
          />
        </dd>

        <dt className="pt-1 text-sm text-muted-foreground">Attachments</dt>
        <dd>
          <TodoAttachments todo={todo} onSave={(image) => save({ image })} />
        </dd>
      </dl>

      <div className="flex w-full justify-end border-t pt-4 text-xs text-muted-foreground">
        Created {format(todo._creationTime, "EEE, MMM d")}
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
            <AlertDialogDescription>
              {fileCount > 0
                ? `“${todo.text}” and its ${fileCount === 1 ? "file" : `${fileCount} files`} will be deleted. You cannot undo this.`
                : `“${todo.text}” will be deleted. You cannot undo this.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => removeTodo({ id: todo._id })}
            >
              {isDeleting ? <Spinner /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement

/* Keeps a local draft and commits it on blur or Enter. Escape drops the draft. Return false from onCommit to drop it too. A multiline field keeps Enter for a new line. */
function useCommitOnBlur(
  value: string,
  onCommit: (next: string) => boolean | void,
  { multiline = false }: { multiline?: boolean } = {}
) {
  const [draft, setDraft] = React.useState(value)
  const [syncedValue, setSyncedValue] = React.useState(value)
  const skipCommit = React.useRef(false)

  /* Take the saved value when it changes, for example from the mobile app */
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  return {
    value: draft,
    onChange: (e: React.ChangeEvent<FieldElement>) => setDraft(e.target.value),
    onBlur: () => {
      if (skipCommit.current) {
        skipCommit.current = false
        return
      }
      if (draft !== value && onCommit(draft) === false) setDraft(value)
    },
    onKeyDown: (e: React.KeyboardEvent<FieldElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !multiline) {
        e.preventDefault()
        e.currentTarget.blur()
      }
      if (e.key === "Escape") {
        skipCommit.current = true
        setDraft(value)
        e.currentTarget.blur()
      }
    },
  }
}
