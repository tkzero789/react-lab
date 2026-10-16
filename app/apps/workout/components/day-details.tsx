"use client"

/* Day view that logs and edits exercises in one overlay, step by step */

import React from "react"
import { format, isToday, parseISO } from "date-fns"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DumbbellIcon,
  PlusIcon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { formatWeight, getTopSet, getVolume, numberFormat } from "../lib/sets"
import ExercisePicker, { type Exercise } from "./exercise-picker"
import ExerciseThumbnail from "./exercise-thumbnail"
import SetsForm, { type WorkoutSets } from "./sets-form"
import StepTransition, { type Direction } from "./step-transition"

type Log = Doc<"workoutLogs">

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  exercises: Exercise[]
  logs: Log[]
  allLogs: Log[]
  onAdd: (date: string, exerciseId: Id<"exercises">, sets: WorkoutSets) => void
  onUpdate: (id: Id<"workoutLogs">, sets: WorkoutSets) => void
  onRemove: (id: Id<"workoutLogs">) => void
}

type Step =
  | { name: "day" }
  | { name: "pick" }
  | {
      name: "sets"
      exerciseId: Id<"exercises">
      logId?: Id<"workoutLogs">
      from: "day" | "pick"
    }

const STEP_DEPTH: Record<Step["name"], number> = { day: 0, pick: 1, sets: 2 }
const INITIAL_NAV = { step: { name: "day" } as Step, direction: 1 as Direction }

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

function getLastSession(
  exerciseId: Id<"exercises">,
  dateStr: string,
  allLogs: Log[]
) {
  return allLogs
    .filter((l) => l.exerciseId === exerciseId && l.date < dateStr)
    .reduce<
      Log | undefined
    >((latest, l) => (!latest || l.date > latest.date ? l : latest), undefined)
}

function ProgressNote({ progress }: { progress: Progress }) {
  const { change, lastDate } = progress
  const since = format(parseISO(lastDate), "MMM d")

  if (change === 0) {
    return <span className="flex items-center gap-1">Same as {since}</span>
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
  onEdit,
}: {
  log: Log
  exercise: Exercise | undefined
  progress: Progress | null
  onEdit: () => void
}) {
  const volume = getVolume(log.sets)
  const name = exercise?.name ?? "Unknown exercise"

  return (
    <li className="overflow-hidden rounded-lg border bg-card">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors outline-none hover:bg-button-muted-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-button-muted-hover"
      >
        <ExerciseThumbnail src={exercise?.thumbnailUrl} size={44} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{name}</span>
            {progress?.isPR && (
              <Badge className="gap-1 [&_svg]:size-3">
                <TrophyIcon aria-hidden />
                PR
              </Badge>
            )}
          </span>
          {exercise && exercise.muscleGroups.length > 0 && (
            <span className="flex flex-wrap items-center gap-2">
              {exercise.muscleGroups.map((mg) => (
                <Badge key={mg} variant="secondary" className="w-fit">
                  {mg}
                </Badge>
              ))}
            </span>
          )}
        </span>
        <ChevronRightIcon className="size-4 shrink-0" aria-hidden />
      </button>

      <table className="w-full border-t text-sm tabular-nums">
        <thead className="bg-muted text-xs">
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
            <tr key={index}>
              <td className="py-2 pl-3">{index + 1}</td>
              <td className="py-2 text-right">{formatWeight(set.weight)}</td>
              <td className="py-2 pr-3 text-right">{set.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs">
        <span>Volume {numberFormat.format(volume)} reps</span>
        {progress && <ProgressNote progress={progress} />}
      </div>
    </li>
  )
}

/* Animate the footer in and out, so the overlay does not jump between steps */
function StepFooter({
  children,
  render,
}: {
  children: React.ReactNode
  render: (children: React.ReactNode) => React.ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.div
          key="footer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="mt-auto shrink-0 overflow-hidden"
        >
          {render(children)}
        </motion.div>
      )}
    </AnimatePresence>
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
  const formId = React.useId()
  const [nav, setNav] = React.useState(INITIAL_NAV)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const { step, direction } = nav

  const dateStr = format(date, "yyyy-MM-dd")
  const exerciseById = new Map(exercises.map((e) => [e._id, e]))
  const loggedExerciseIds = new Set(logs.map((l) => l.exerciseId))

  function go(next: Step) {
    setNav((prev) => ({
      step: next,
      direction: STEP_DEPTH[next.name] >= STEP_DEPTH[prev.step.name] ? 1 : -1,
    }))
  }

  function back() {
    go(step.name === "sets" ? { name: step.from } : { name: "day" })
  }

  /* Reset after the close animation, so the user does not see the step change */
  function handleOpenChangeComplete(isOpen: boolean) {
    if (isOpen) return
    setNav(INITIAL_NAV)
    setConfirmDelete(false)
  }

  /* An exercise that is already logged on this day opens its log, not a duplicate */
  function pickExercise(exercise: Exercise) {
    const existing = logs.find((l) => l.exerciseId === exercise._id)
    go({
      name: "sets",
      exerciseId: exercise._id,
      logId: existing?._id,
      from: "pick",
    })
  }

  const dayTitle = isToday(date) ? "Today" : format(date, "EEEE")
  const editingLog =
    step.name === "sets" && step.logId
      ? logs.find((l) => l._id === step.logId)
      : undefined
  const stepExercise =
    step.name === "sets" ? exerciseById.get(step.exerciseId) : undefined

  let title: string
  let description: string
  let body: React.ReactNode
  let footer: React.ReactNode = null

  if (step.name === "pick") {
    title = "Choose exercise"
    body = (
      <ExercisePicker
        exercises={exercises}
        loggedExerciseIds={loggedExerciseIds}
        onSelect={pickExercise}
      />
    )
  } else if (step.name === "sets" && stepExercise) {
    title = editingLog ? "Edit sets" : "Log sets"
    body = (
      <SetsForm
        id={formId}
        exercise={stepExercise}
        defaultSets={editingLog?.sets}
        lastSession={getLastSession(stepExercise._id, dateStr, allLogs)}
        onSubmit={(sets) => {
          if (editingLog) onUpdate(editingLog._id, sets)
          else onAdd(dateStr, stepExercise._id, sets)
          go({ name: "day" })
        }}
      />
    )
    footer = (
      <>
        {editingLog && (
          <Button
            variant="destructive"
            size="icon"
            aria-label="Remove"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2Icon />
          </Button>
        )}
        <Button form={formId} type="submit" className="md:order-last">
          {editingLog ? "Save changes" : "Save workout"}
        </Button>
      </>
    )
  } else {
    title = dayTitle
    body =
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
          <ul className="flex flex-col gap-3">
            {logs.map((log) => (
              <LogCard
                key={log._id}
                log={log}
                exercise={exerciseById.get(log.exerciseId)}
                progress={getProgress(log, allLogs)}
                onEdit={() =>
                  go({
                    name: "sets",
                    exerciseId: log.exerciseId,
                    logId: log._id,
                    from: "day",
                  })
                }
              />
            ))}
          </ul>
        </div>
      )
    footer = (
      <Button
        disabled={exercises.length === 0}
        onClick={() => go({ name: "pick" })}
        className="w-full"
      >
        <PlusIcon data-icon="inline-start" />
        Log exercise
      </Button>
    )
  }

  const stepKey =
    step.name === "sets" ? `sets-${step.exerciseId}-${step.logId}` : step.name
  const backButton = step.name !== "day" && (
    <Button variant="ghost" onClick={back} className="mr-auto">
      Back
    </Button>
  )
  const animatedBody = (
    <StepTransition stepKey={stepKey} direction={direction} fill>
      {body}
    </StepTransition>
  )
  /* Delete needs a clear decision, so it uses the alert dialog on all screens */
  const deleteDialog = editingLog && (
    <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>
            Remove <span className="font-medium">{stepExercise?.name}</span>{" "}
            from {format(date, "EEEE, MMM d, yyyy")}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onRemove(editingLog._id)
              setConfirmDelete(false)
              go({ name: "day" })
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <MotionConfig reducedMotion="user">
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={handleOpenChangeComplete}
      >
        <DialogContent className="md:h-[min(40rem,calc(100dvh-4rem))] md:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogBody className="overflow-hidden p-0">
            {animatedBody}
          </DialogBody>
          <StepFooter render={(c) => <DialogFooter>{c}</DialogFooter>}>
            {backButton}
            {footer}
          </StepFooter>
          {deleteDialog}
        </DialogContent>
      </Dialog>
    </MotionConfig>
  )
}
