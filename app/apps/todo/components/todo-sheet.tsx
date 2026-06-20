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
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type Todo = FunctionReturnType<typeof api.todos.list>[number]

const FORM_ID = "todoForm"

type Props = {
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
  const [activeTodo, setActiveTodo] = React.useState(todo)
  const [isEditing, setIsEditing] = React.useState<boolean>(false)

  const [prevTodoId, setPrevTodoId] = React.useState(todo?._id)
  if (todo?._id !== prevTodoId) {
    setPrevTodoId(todo?._id)
    if (todo) {
      setActiveTodo(todo)
    }
    setIsEditing(false)
  }

  console.log("activeTodo", activeTodo?._id)
  console.log("prevTodoId", prevTodoId)

  const isSelected = activeTodo != null
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

  const { mutate: submitTodo, isPending: isSaving } = useMutation({
    mutationFn: async (values: TodoFormValues) => {
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
          <SheetTitle>{isSelected ? "Edit todo" : "Add todo"}</SheetTitle>
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
          {isSelected && (
            <AlertDialog open={isDelete} onOpenChange={onDeleteChange}>
              <AlertDialogTrigger
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
              <AlertDialogOverlay forceRender />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete todo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this todo? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => removeTodo({ id: activeTodo._id })}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isSelected && !isEditing && (
              <Button variant="muted" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
            {isSelected && isEditing && (
              <Button form={FORM_ID} type="submit" disabled={isSaving}>
                {isSaving && <Spinner />}
                Save changes
              </Button>
            )}
            {!isSelected && !isEditing && (
              <Button form={FORM_ID} type="submit" disabled={isSaving}>
                {isSaving && <Spinner />}
                Add todo
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
