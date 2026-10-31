"use client"

/* Side panel form that adds a todo. Files stay in the browser until the user submits. */

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FunctionArgs } from "convex/server"
import { XIcon } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUploadFile } from "@/hooks/use-upload-file"
import { toast } from "@/lib/toast"
import TodoAttachmentGrid from "./todo-attachment-grid"
import TodoDateField from "./todo-date-field"
import TodoListField from "./todo-list-field"
import TodoLocationField from "./todo-location-field"
import { LocationValue } from "../places"
import { List } from "../types"

type DraftFile = {
  id: string
  file: File
  /* Object URL for the preview. Revoke it when the file leaves the form. */
  url: string
}

type Props = {
  lists: List[]
  /* The list that the user views when they start the todo */
  defaultListId: Id<"todoLists"> | null
  onAdded: (id: Id<"todos">) => void
  /* The parent unmounts the form, which resets every field */
  onClose: () => void
}

export default function TodoNew({
  lists,
  defaultListId,
  onAdded,
  onClose,
}: Props) {
  const id = React.useId()
  const [text, setText] = React.useState("")
  const [date, setDate] = React.useState(0)
  const [listId, setListId] = React.useState(defaultListId)
  const [location, setLocation] = React.useState<LocationValue>({
    location: "",
    coordinates: null,
  })
  const [drafts, setDrafts] = React.useState<DraftFile[]>([])

  /* The cleanup runs on unmount and needs the latest drafts */
  const draftsRef = React.useRef(drafts)
  React.useEffect(() => {
    draftsRef.current = drafts
  })
  React.useEffect(
    () => () => {
      for (const item of draftsRef.current) URL.revokeObjectURL(item.url)
    },
    []
  )

  const uploadFile = useUploadFile()
  const addTodo = useConvexMutation(api.todos.add)
  const { mutate: submit, isPending } = useMutation({
    mutationFn: async ({
      files,
      ...args
    }: FunctionArgs<typeof api.todos.add> & { files: File[] }) => {
      const image = await Promise.all(files.map(uploadFile))
      return addTodo({ ...args, image })
    },
    onSuccess: onAdded,
    onError: (error) => toast.error(error.message),
  })

  const canSubmit = text.trim() !== "" && !isPending

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    submit({
      text: text.trim(),
      date,
      location: location.location,
      coordinates: location.coordinates ?? undefined,
      listId: listId ?? undefined,
      files: drafts.map((item) => item.file),
    })
  }

  function addFiles(added: File[]) {
    setDrafts((prev) => [
      ...prev,
      ...added.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      })),
    ])
  }

  function removeFile(fileId: string) {
    const item = drafts.find((draft) => draft.id === fileId)
    if (item) URL.revokeObjectURL(item.url)
    setDrafts((prev) => prev.filter((draft) => draft.id !== fileId))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">New todo</h2>
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
          autoFocus
          placeholder="Enter your task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
          className="-mx-2.5 field-sizing-content w-[calc(100%+1.25rem)] resize-none rounded-md bg-transparent px-2.5 py-1.5 text-xl leading-snug outline-none placeholder:text-muted-foreground hover:bg-button-ghost-hover focus-visible:bg-input focus-visible:ring-1 focus-visible:ring-ring active:bg-button-ghost-hover"
        />
      </div>

      <dl className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            <label htmlFor={`${id}-date`}>Due date</label>
          </dt>
          <dd className="min-w-0 flex-1">
            <TodoDateField id={`${id}-date`} value={date} onChange={setDate} />
          </dd>
        </div>

        <div className="flex items-center gap-4">
          <dt
            id={`${id}-list`}
            className="w-28 shrink-0 text-sm text-muted-foreground"
          >
            List
          </dt>
          <dd className="min-w-0 flex-1">
            <TodoListField
              labelId={`${id}-list`}
              lists={lists}
              value={listId}
              onChange={setListId}
            />
          </dd>
        </div>

        <div className="flex items-center gap-4">
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            <label htmlFor={`${id}-location`}>Location</label>
          </dt>
          <dd className="min-w-0 flex-1">
            <TodoLocationField
              id={`${id}-location`}
              value={location}
              onChange={setLocation}
            />
          </dd>
        </div>

        <div className="flex items-center gap-4">
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            Attachments
          </dt>
          <dd className="min-w-0 flex-1">
            <TodoAttachmentGrid
              attachments={drafts.map((item) => ({
                id: item.id,
                url: item.url,
                isImage: item.file.type.startsWith("image/"),
                size: item.file.size,
              }))}
              disabled={isPending}
              onAdd={addFiles}
              onRemove={removeFile}
            />
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={!canSubmit}>
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Add todo
        </Button>
      </div>
    </form>
  )
}
