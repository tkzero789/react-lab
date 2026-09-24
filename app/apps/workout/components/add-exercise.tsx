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
import { Plus } from "lucide-react"
import ExerciseForm, { ExerciseFormValues } from "./exercise-form"

export default function AddExercise() {
  const addExercise = useMutation(api.exercises.add)
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  function handleAdd(data: ExerciseFormValues) {
    addExercise(data)
    setOpen(false)
  }

  const trigger = (
    <Button>
      <Plus data-icon="inline-start" />
      Add Exercise
    </Button>
  )
  const form = <ExerciseForm onSubmit={handleAdd} submitLabel="Add Exercise" />

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Exercise</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="p-0">{form}</DrawerBody>
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
