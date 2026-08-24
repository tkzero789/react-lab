"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { toast } from "@/lib/toast"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import TodoForm from "./todo-form"
import { Todo, TodoFormValues } from "../types"

const FORM_ID = "todoForm"

type Props = {
  todo?: Todo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestDelete?: (todo: Todo) => void
}

export default function TodoDialog({
  todo,
  open,
  onOpenChange,
  onRequestDelete,
}: Props) {
  // Mirror the target during render so the form keeps its content through the
  // close animation, and only resync while the dialog is actually open.
  const [activeTodo, setActiveTodo] = React.useState(todo ?? null)
  const [prevKey, setPrevKey] = React.useState(todo?._id ?? null)

  const key = todo?._id ?? null
  if (open && key !== prevKey) {
    setPrevKey(key)
    setActiveTodo(todo ?? null)
  }

  const isEditing = activeTodo !== null

  const generateUploadUrl = useConvexMutation(api.files.generateUploadUrl)
  const addTodo = useConvexMutation(api.todos.add)
  const updateTodo = useConvexMutation(api.todos.update)

  async function uploadFile(file: File) {
    const postUrl = await generateUploadUrl()
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">
    }
    return storageId
  }

  const { mutate: submitTodo, isPending: isSaving } = useMutation({
    mutationFn: async (values: TodoFormValues) => {
      const uploadedIds = await Promise.all(values.files?.map(uploadFile) ?? [])
      const image = [
        ...(values.imageIds ?? []),
        ...uploadedIds,
      ] as Id<"_storage">[]

      if (activeTodo) {
        await updateTodo({
          id: activeTodo._id,
          text: values.text,
          date: values.date,
          location: values.location,
          image,
        })
      } else {
        await addTodo({
          text: values.text,
          date: values.date,
          location: values.location,
          image,
        })
      }
    },
    onSuccess: () => onOpenChange(false),
    onError: (error) => toast.error(error.message),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit todo" : "New todo"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">
          <TodoForm
            key={activeTodo?._id ?? "new"}
            id={FORM_ID}
            todo={activeTodo ?? undefined}
            onSubmit={(values) => submitTodo(values)}
          />
        </DialogBody>
        <DialogFooter>
          {isEditing && onRequestDelete ? (
            <Button
              variant="ghost-destructive"
              onClick={() => {
                onRequestDelete(activeTodo)
                onOpenChange(false)
              }}
            >
              <Trash2Icon data-icon="inline-start" />
              Delete
            </Button>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <Button form={FORM_ID} type="submit" disabled={isSaving}>
              {isSaving ? <Spinner /> : null}
              {isEditing ? "Save" : "Add todo"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
