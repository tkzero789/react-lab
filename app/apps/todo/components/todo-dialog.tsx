"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import TodoForm from "./todo-form"

import { Trash2Icon } from "lucide-react"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Todo, TodoFormValues } from "../types"

const FORM_ID = "todoForm"

type Props = {
  todo?: Todo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isDelete?: boolean
  onDeleteChange?: (isDelete: boolean) => void
}

export default function TodoDialog({
  todo,
  open,
  onOpenChange,
  isDelete,
  onDeleteChange,
}: Props) {
  const [activeTodo, setActiveTodo] = React.useState(todo)

  const [prevTodoId, setPrevTodoId] = React.useState(todo?._id)
  if (todo?._id !== prevTodoId) {
    setPrevTodoId(todo?._id)
    if (todo) {
      setActiveTodo(todo)
    }
  }

  const isSelected = activeTodo != null

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

  const { mutate: removeTodo, isPending: isDeleting } = useMutation({
    mutationFn: useConvexMutation(api.todos.remove),
    onSuccess: () => {
      if (onDeleteChange) {
        onDeleteChange(false)
        onOpenChange(false)
      }
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSelected ? "Edit todo" : "Add todo"}</DialogTitle>
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
          {isSelected && (
            <Dialog type="alert" open={isDelete} onOpenChange={onDeleteChange}>
              <DialogTrigger
                render={
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={isDeleting}
                  >
                    {isDeleting && <Spinner />}
                    <Trash2Icon />
                  </Button>
                }
              />
              <DialogPortal>
                <DialogOverlay forceRender />
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogDescription>
                      Delete this todo from your list?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => removeTodo({ id: activeTodo._id })}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button form={FORM_ID} type="submit" disabled={isSaving}>
              {isSaving && <Spinner />}
              {isSelected ? "Save changes" : "Add todo"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
