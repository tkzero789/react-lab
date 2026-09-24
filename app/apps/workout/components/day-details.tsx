"use client"

import React from "react"
import { format } from "date-fns"
import { ArrowDown, ArrowUp } from "lucide-react"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useIsMobile } from "@/hooks/use-mobile"
import DeleteLog from "./delete-log"
import LogExercise from "./log-exercise"

type Props = Pick<
  React.ComponentProps<typeof LogExercise>,
  "exercises" | "onAdd" | "date"
> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  logs: Doc<"workoutLogs">[]
  onRemove: (id: Id<"workoutLogs">) => void
}

export default function DayDetails({
  open,
  onOpenChange,
  date,
  logs,
  exercises,
  onAdd,
  onRemove,
}: Props) {
  const isMobile = useIsMobile()

  function getExercise(id: Id<"exercises">) {
    return exercises.find((e) => e._id === id)
  }

  function getWeightComparison(exerciseId: Id<"exercises">, weight: number) {
    const exercise = getExercise(exerciseId)
    if (!exercise || exercise.personalBest === 0) return null
    const diff = weight - exercise.personalBest
    if (diff > 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <ArrowUp className="size-4" />
          New PR +{diff} lbs
        </span>
      )
    if (diff < 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <ArrowDown className="size-4" />
          {diff} lbs from PB
        </span>
      )
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-brand">
        At PB
      </span>
    )
  }

  const title = format(date, "EEEE, MMM d, yyyy")
  const content =
    logs.length === 0 ? (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No exercises logged for this day.
      </p>
    ) : (
      <div className="flex flex-col gap-3">
        {logs.map((log) => {
          const exercise = getExercise(log.exerciseId)
          const maxWeight = Math.max(...log.sets.map((s) => s.weight))
          return (
            <div
              key={log._id}
              className="flex flex-col gap-2 rounded-lg border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {exercise?.name ?? "Unknown"}
                  </span>
                  {getWeightComparison(log.exerciseId, maxWeight)}
                </div>
                <DeleteLog
                  exerciseName={exercise?.name}
                  date={date}
                  onConfirm={() => onRemove(log._id)}
                />
              </div>
              <ul className="flex flex-col gap-2">
                {log.sets.map((set, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-muted px-2 py-1 text-sm"
                  >
                    Set {index + 1}: {set.reps} reps × {set.weight} lbs
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  const logExercise = (
    <LogExercise exercises={exercises} date={date} onAdd={onAdd} />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90dvh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="min-h-0 overflow-y-auto">{content}</DrawerBody>
          <DrawerFooter>{logExercise}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{content}</DialogBody>
        <DialogFooter>{logExercise}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
