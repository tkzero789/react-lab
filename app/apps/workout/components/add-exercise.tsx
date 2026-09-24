"use client"

import React from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUploadFile } from "@/hooks/use-upload-file"
import { toast } from "@/lib/toast"
import { Plus } from "lucide-react"
import ExerciseForm, { ExerciseFormValues } from "./exercise-form"

export default function AddExercise() {
  const addExercise = useMutation(api.exercises.add)
  const uploadFile = useUploadFile()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  function handleAdd({ thumbnail, ...data }: ExerciseFormValues) {
    startTransition(async () => {
      try {
        const storageId = thumbnail ? await uploadFile(thumbnail) : undefined
        await addExercise({ ...data, thumbnail: storageId })
        setOpen(false)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not add exercise"
        )
      }
    })
  }

  const trigger = (
    <Button>
      <Plus data-icon="inline-start" />
      Add Exercise
    </Button>
  )
  const form = (
    <ExerciseForm
      onSubmit={handleAdd}
      submitLabel="Add Exercise"
      isPending={isPending}
    />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={trigger} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Exercise</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col p-0">{form}</DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">{form}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
