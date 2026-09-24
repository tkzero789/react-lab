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
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import LogExerciseForm from "./log-exercise-form"

type Props = Pick<
  React.ComponentProps<typeof LogExerciseForm>,
  "exercises" | "onAdd"
> & {
  date: Date
}

/* On mobile this is a nested drawer, so it must render inside DayDetails */
export default function LogExercise({ exercises, onAdd, date }: Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const title = `Log Exercise - ${format(date, "MMM d, yyyy")}`
  const trigger = (
    <Button disabled={exercises.length === 0} className="w-full">
      Log Exercise
    </Button>
  )
  const form = (
    <LogExerciseForm
      exercises={exercises}
      dateStr={format(date, "yyyy-MM-dd")}
      onAdd={onAdd}
      onClose={() => setOpen(false)}
    />
  )
  /* The button is outside the form, so it links to the form by ID */
  const submit = (
    <Button form="logWorkout" type="submit" className="w-full">
      Save Workout
    </Button>
  )

  if (isMobile) {
    return (
      <DrawerNested open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90dvh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="min-h-0 overflow-y-auto">{form}</DrawerBody>
          <DrawerFooter>{submit}</DrawerFooter>
        </DrawerContent>
      </DrawerNested>
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
