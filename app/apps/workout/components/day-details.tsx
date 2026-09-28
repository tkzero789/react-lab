"use client"

/* Logged exercises and progress for one calendar day */

import React from "react"
import type { FunctionReturnType } from "convex/server"
import { format, isToday, parseISO } from "date-fns"
import {
  DumbbellIcon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  formatWeight,
  getTopSet,
  getVolume,
  numberFormat,
} from "../lib/sets"
import ExerciseThumbnail from "./exercise-thumbnail"
import LogActions from "./log-actions"
import LogExercise from "./log-exercise"
import { WorkoutSets } from "./log-exercise-form"

type Log = Doc<"workoutLogs">
type Exercise = FunctionReturnType<typeof api.exercises.list>[number]

type Props = Pick<
  React.ComponentProps<typeof LogExercise>,
  "onAdd" | "date"
> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercises: Exercise[]
  logs: Log[]
  allLogs: Log[]
  onUpdate: (id: Id<"workoutLogs">, sets: WorkoutSets) => void
  onRemove: (id: Id<"workoutLogs">) => void
}

type Progress = {
  isPR: boolean
  change: number
  lastDate: string
}

/* Compare with earlier days, not with personalBest. personalBest can include later days. */
function getProgress(log: Log, allLogs: Log[]): Progress | null {
  const topWeight = getTopSet(log.sets)?.weight ?? 0
  /* ISO date strings sort in date order, so a string compare is safe */
  const earlier = allLogs.filter(
    (l) => l.exerciseId === log.exerciseId && l.date < log.date
  )
  if (topWeight === 0 || earlier.length === 0) return null

  const previousBest = Math.max(
    ...earlier.map((l) => getTopSet(l.sets)?.weight ?? 0)
  )
  const last = earlier.reduce((latest, l) =>
    l.date > latest.date ? l : latest
  )
  return {
    isPR: topWeight > previousBest,
    change: topWeight - (getTopSet(last.sets)?.weight ?? 0),
    lastDate: last.date,
  }
}

function DaySummary({ logs }: { logs: Log[] }) {
  const sets = logs.flatMap((l) => l.sets)
  const stats = [
    { label: "Exercises", value: new Set(logs.map((l) => l.exerciseId)).size },
    { label: "Sets", value: sets.length },
    { label: "Volume (reps)", value: getVolume(sets) },
  ]

  return (
    <dl className="grid grid-cols-3 divide-x rounded-lg border">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse items-center gap-0.5 p-2"
        >
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {numberFormat.format(stat.value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ProgressNote({ progress }: { progress: Progress }) {
  const { change, lastDate } = progress
  const since = format(parseISO(lastDate), "MMM d")

  if (change === 0) {
    return (
      <span className="flex items-center gap-1">
        <MinusIcon className="size-3.5" aria-hidden />
        Same as {since}
      </span>
    )
  }

  const Icon = change > 0 ? TrendingUpIcon : TrendingDownIcon
  return (
    <span
      className={cn(
        "flex items-center gap-1",
        change > 0 && "font-medium text-foreground"
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {change > 0 ? "+" : "−"}
      {formatWeight(Math.abs(change))} vs {since}
    </span>
  )
}

function LogCard({
  log,
  exercise,
  progress,
  actions,
}: {
  log: Log
  exercise: Exercise | undefined
  progress: Progress | null
  actions: React.ReactNode
}) {
  const topSet = getTopSet(log.sets)
  const volume = getVolume(log.sets)

  return (
    <li className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-3 p-3">
        <ExerciseThumbnail src={exercise?.thumbnailUrl} size={44} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium">
              {exercise?.name ?? "Unknown exercise"}
            </div>
            {progress?.isPR && (
              <Badge className="gap-1 [&_svg]:size-3">
                <TrophyIcon aria-hidden />
                PR
              </Badge>
            )}
          </div>
          {exercise && exercise.muscleGroups.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {exercise.muscleGroups.map((mg) => (
                <Badge key={mg} variant="secondary" className="w-fit">
                  {mg}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {actions}
      </div>

      <table className="w-full border-t text-sm tabular-nums">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="w-14 py-1.5 pl-3 text-left font-normal">
              Set
            </th>
            <th scope="col" className="py-1.5 text-right font-normal">
              Weight
            </th>
            <th scope="col" className="w-20 py-1.5 pr-3 text-right font-normal">
              Reps
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {log.sets.map((set, index) => (
            <tr
              key={index}
              className={cn(
                log.sets.length > 1 && set === topSet && "font-semibold"
              )}
            >
              <td className="py-2 pl-3 text-muted-foreground">{index + 1}</td>
              <td className="py-2 text-right">{formatWeight(set.weight)}</td>
              <td className="py-2 pr-3 text-right">{set.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
        <span>Volume {numberFormat.format(volume)} reps</span>
        {progress && <ProgressNote progress={progress} />}
      </div>
    </li>
  )
}

export default function DayDetails({
  open,
  onOpenChange,
  date,
  logs,
  allLogs,
  exercises,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const isMobile = useIsMobile()
  const exerciseById = new Map(exercises.map((e) => [e._id, e]))

  const title = isToday(date) ? "Today" : format(date, "EEEE")
  const description = format(date, "MMMM d, yyyy")
  const content =
    logs.length === 0 ? (
      <Empty className="p-8 md:p-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DumbbellIcon />
          </EmptyMedia>
          <EmptyTitle className="text-base">No workout logged</EmptyTitle>
          <EmptyDescription>
            {exercises.length === 0
              ? "Add an exercise first, then log it here."
              : "Log an exercise to track this day."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    ) : (
      <div className="flex flex-col gap-4">
        <DaySummary logs={logs} />
        <ul className="flex flex-col gap-3">
          {logs.map((log) => {
            const exercise = exerciseById.get(log.exerciseId)
            return (
              <LogCard
                key={log._id}
                log={log}
                exercise={exercise}
                progress={getProgress(log, allLogs)}
                actions={
                  <LogActions
                    log={log}
                    exercises={exercises}
                    exerciseName={exercise?.name}
                    date={date}
                    onUpdate={(sets) => onUpdate(log._id, sets)}
                    onRemove={() => onRemove(log._id)}
                  />
                }
              />
            )
          })}
        </ul>
      </div>
    )
  const logExercise = (
    <LogExercise exercises={exercises} date={date} onAdd={onAdd} />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>{content}</DrawerBody>
          <DrawerFooter>{logExercise}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>{content}</DialogBody>
        <DialogFooter>{logExercise}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
