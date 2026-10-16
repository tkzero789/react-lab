"use client"

/* Sets editor for one exercise in the log flow */

import React from "react"
import { format, parseISO } from "date-fns"
import { AnimatePresence, motion } from "motion/react"
import { MinusCircleIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Doc } from "@/convex/_generated/dataModel"
import { formatSet, formatWeight, getTopSet } from "../lib/sets"
import ExerciseThumbnail from "./exercise-thumbnail"
import { ExerciseInfo, type Exercise } from "./exercise-picker"

export type WorkoutSets = Doc<"workoutLogs">["sets"]

type SetRow = { id: string; weight: string; reps: string }

type Props = {
  id: string
  exercise: Exercise
  defaultSets?: WorkoutSets
  lastSession?: { date: string; sets: WorkoutSets }
  onSubmit: (sets: WorkoutSets) => void
}

/* Rows need a stable key, so the enter animation runs on the new row only */
function toRow(set?: { weight: number | string; reps: number | string }) {
  return {
    id: crypto.randomUUID(),
    weight: set ? String(set.weight) : "",
    reps: set ? String(set.reps) : "",
  }
}

function ExerciseHeader({
  exercise,
  lastSession,
}: Pick<Props, "exercise" | "lastSession">) {
  const lastTop = lastSession && getTopSet(lastSession.sets)

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <ExerciseThumbnail src={exercise.thumbnailUrl} size={56} />
        <ExerciseInfo exercise={exercise} />
        {exercise.personalBest > 0 && (
          <div className="flex shrink-0 flex-col items-end">
            <span className="text-xs text-muted-foreground">PB</span>
            <span className="font-medium tabular-nums">
              {formatWeight(exercise.personalBest)}
            </span>
          </div>
        )}
      </div>
      {lastSession && lastTop && (
        <p className="flex items-center gap-1.5 border-t pt-2 text-xs text-muted-foreground">
          Last time {format(parseISO(lastSession.date), "MMM d")}:{" "}
          {lastSession.sets.length} sets, top {formatSet(lastTop)}
        </p>
      )}
    </div>
  )
}

export default function SetsForm({
  id,
  exercise,
  defaultSets,
  lastSession,
  onSubmit,
}: Props) {
  const [rows, setRows] = React.useState<SetRow[]>(() =>
    defaultSets?.length ? defaultSets.map(toRow) : [toRow()]
  )
  const [error, setError] = React.useState<string | null>(null)

  /* A new set copies the previous set, because most sets repeat the same weight */
  function addRow() {
    setRows([...rows, toRow(rows.at(-1))])
  }

  function removeRow(rowId: string) {
    setRows(rows.filter((r) => r.id !== rowId))
  }

  function updateRow(rowId: string, field: "weight" | "reps", value: string) {
    setRows(rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)))
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const sets = rows
      .filter((r) => r.reps && r.weight)
      .map((r) => ({ reps: parseInt(r.reps), weight: parseFloat(r.weight) }))
    if (sets.length === 0) {
      setError("Enter weight and reps for at least one set.")
      return
    }
    setError(null)
    onSubmit(sets)
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ExerciseHeader exercise={exercise} lastSession={lastSession} />

      <div className="grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-x-2 gap-y-2">
        <span className="text-center text-xs text-muted-foreground">Set</span>
        <span className="text-xs text-muted-foreground">Weight (lbs)</span>
        <span className="text-xs text-muted-foreground">Reps</span>
        <span />
        <AnimatePresence initial={false}>
          {rows.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="col-span-full grid grid-cols-subgrid items-center"
            >
              <span className="text-center text-sm font-medium text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                placeholder="0"
                aria-label={`Set ${i + 1} weight`}
                value={row.weight}
                onChange={(e) => updateRow(row.id, "weight", e.target.value)}
              />
              <Input
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="0"
                aria-label={`Set ${i + 1} reps`}
                value={row.reps}
                onChange={(e) => updateRow(row.id, "reps", e.target.value)}
              />
              {rows.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost-destructive"
                  size="icon-sm"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove set ${i + 1}`}
                >
                  <MinusCircleIcon />
                </Button>
              ) : (
                <span />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button type="button" variant="outline" onClick={addRow}>
        <PlusIcon data-icon="inline-start" />
        Add set
      </Button>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
