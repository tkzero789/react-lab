"use client"

import React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Id } from "@/convex/_generated/dataModel"
import { useIsMobile } from "@/hooks/use-mobile"
import LogExerciseForm, { WorkoutSets } from "./log-exercise-form"

type Props = Pick<React.ComponentProps<typeof LogExerciseForm>, "exercises"> & {
  date: Date
  onAdd: (date: string, exerciseId: Id<"exercises">, sets: WorkoutSets) => void
}

/* On mobile this is a nested drawer, so it must render inside DayDetails */
export default function LogExercise({ exercises, onAdd, date }: Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const formId = React.useId()

  const title = `Log Exercise - ${format(date, "MMM d, yyyy")}`
  const trigger = (
    <Button disabled={exercises.length === 0} className="w-full">
      Log Exercise
    </Button>
  )
  const form = (
    <LogExerciseForm
      id={formId}
      exercises={exercises}
      onSubmit={(exerciseId, sets) => {
        onAdd(format(date, "yyyy-MM-dd"), exerciseId, sets)
        setOpen(false)
      }}
    />
  )
  /* The button is outside the form, so it links to the form by ID */
  const submit = (
    <Button form={formId} type="submit" className="w-full">
      Save Workout
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} fitContent>
        <DrawerTrigger render={trigger} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>{form}</DrawerBody>
          <DrawerFooter>{submit}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{form}</DialogBody>
        <DialogFooter>{submit}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
