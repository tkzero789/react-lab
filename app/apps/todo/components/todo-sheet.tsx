"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import type { FunctionReturnType } from "convex/server"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import TodoForm, { type TodoFormValues } from "./todo-form"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Trash2Icon } from "lucide-react"

export type Todo = FunctionReturnType<typeof api.todos.list>[number]

const FORM_ID = "todoForm"

type Props = {
  // `null`/`undefined` => create mode; a todo => edit mode.
  todo?: Todo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isDelete?: boolean
  onDeleteChange?: (isDelete: boolean) => void
}

export default function TodoSheet({
  todo,
  open,
  onOpenChange,
  isDelete,
  onDeleteChange,
}: Props) {
  // Keep rendering the last todo through the close animation instead of
  // flickering to "Add" mode. Adjusting state during render (not a ref) is the
  // compiler-safe way to remember the previous prop.
  const [activeTodo, setActiveTodo] = React.useState(todo)
  if (todo && todo._id !== activeTodo?._id) {
    setActiveTodo(todo)
  }
  const isEditing = activeTodo != null
  const isMobile = useIsMobile()

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

  // One mutation covers the whole submit (optional upload + add/update), so a
  // single `isSaving` drives the Save button.
  const { mutate: submitTodo, isPending: isSaving } = useMutation({
    mutationFn: async (values: TodoFormValues) => {
      // Upload the fresh picks, then persist kept-existing ids plus the new ones.
      const uploadedIds = await Promise.all(values.files.map(uploadFile))
      const image = [...(values.imageIds as Id<"_storage">[]), ...uploadedIds]

      if (activeTodo) {
        await updateTodo({
          id: activeTodo._id,
          text: values.text,
          date: values.date,
          location: values.location,
          url: values.url,
          image,
        })
      } else {
        await addTodo({
          text: values.text,
          date: values.date,
          location: values.location,
          url: values.url,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent variant="float" side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit todo" : "Add todo"}</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-1 flex-col p-0">
          <TodoForm
            key={activeTodo?._id ?? "new"}
            id={FORM_ID}
            todo={activeTodo ?? undefined}
            onSubmit={(values) => submitTodo(values)}
          />
        </SheetBody>
        <SheetFooter>
          {isEditing && (
            <Sheet modal={false} open={isDelete} onOpenChange={onDeleteChange}>
              <SheetTrigger
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
              <SheetOverlay forceRender />
              <SheetContent
                side={isMobile ? "bottom" : "right"}
                variant="compact"
                showCloseButton={false}
              >
                <SheetHeader>
                  <SheetTitle>Delete todo</SheetTitle>
                </SheetHeader>
                <SheetFooter className="border-t-0">
                  <SheetClose
                    render={
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    }
                  ></SheetClose>
                  <Button
                    variant="destructive"
                    onClick={() => removeTodo({ id: activeTodo._id })}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="muted">Mark complete</Button>
            <Button form={FORM_ID} type="submit" disabled={isSaving}>
              {isSaving && <Spinner data-icon="inline-start" />}
              {isEditing ? "Save changes" : "Add todo"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
