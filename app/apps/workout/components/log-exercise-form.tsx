"use client"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { MinusCircleIcon, Plus } from "lucide-react"
import React, { useState } from "react"

type Exercise = {
  _id: Id<"exercises">
  name: string
  muscleGroups: string[]
  personalBest: number
}

export type WorkoutSets = Doc<"workoutLogs">["sets"]

type Props = {
  id: string
  exercises: Exercise[]
  defaultValues?: { exerciseId: Id<"exercises">; sets: WorkoutSets }
  lockExercise?: boolean
  onSubmit: (exerciseId: Id<"exercises">, sets: WorkoutSets) => void
}

export default function LogExerciseForm({
  id,
  exercises,
  defaultValues,
  lockExercise = false,
  onSubmit,
}: Props) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    () => exercises.find((e) => e._id === defaultValues?.exerciseId) ?? null
  )
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>(
    () =>
      defaultValues?.sets.map((s) => ({
        reps: String(s.reps),
        weight: String(s.weight),
      })) ?? [{ reps: "", weight: "" }]
  )
  const [listOpen, setListOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const anchor = useComboboxAnchor()

  function addSet() {
    setSets([...sets, { reps: "", weight: "" }])
  }

  function removeSet(index: number) {
    if (sets.length <= 1) return
    setSets(sets.filter((_, i) => i !== index))
  }

  function updateSet(index: number, field: "reps" | "weight", value: string) {
    setSets(sets.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    /* Typed text does not select an exercise. The user must pick an option. */
    if (!selectedExercise) {
      setError("Pick an exercise from the list.")
      return
    }
    const parsedSets = sets
      .filter((s) => s.reps && s.weight)
      .map((s) => ({
        reps: parseInt(s.reps),
        weight: parseFloat(s.weight),
      }))
    if (parsedSets.length === 0) {
      setError("Enter reps and weight for at least one set.")
      return
    }
    setError(null)
    onSubmit(selectedExercise._id, parsedSets)
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Exercises */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Exercise</label>
        <Combobox
          items={exercises}
          value={selectedExercise}
          onValueChange={(value) =>
            setSelectedExercise(value as Exercise | null)
          }
          itemToStringLabel={(ex: Exercise) => ex.name}
          itemToStringValue={(ex: Exercise) => ex._id}
          disabled={lockExercise}
          open={listOpen}
          onOpenChange={setListOpen}
        >
          {/*
           * In a drawer, a tap on the input sends an untrusted click.
           * The combobox ignores it, so the input opens the list itself.
           */}
          <ComboboxInput
            placeholder="Search exercises"
            disabled={lockExercise}
            onClick={() => setListOpen(true)}
          />
          <ComboboxContent anchor={anchor} className="pointer-events-auto">
            <ComboboxEmpty>No exercises found.</ComboboxEmpty>
            <ComboboxList>
              {(ex: Exercise) => (
                <ComboboxItem
                  key={ex._id}
                  value={ex}
                  className="flex items-center justify-between"
                >
                  {ex.name}
                  <span>
                    {ex.personalBest > 0 ? ` (PB: ${ex.personalBest} lbs)` : ""}
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Sets */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Sets</label>
        <div className="flex flex-col gap-2">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-center text-xs text-muted-foreground">
                #{i + 1}
              </span>
              <Input
                type="number"
                placeholder="Reps"
                min="1"
                value={set.reps}
                onChange={(e) => updateSet(i, "reps", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Weight (lbs)"
                min="0"
                step="0.5"
                value={set.weight}
                onChange={(e) => updateSet(i, "weight", e.target.value)}
                className="flex-1"
              />
              {sets.length > 1 && (
                <Button
                  type="button"
                  variant="ghost-destructive"
                  size="icon-sm"
                  onClick={() => removeSet(i)}
                  aria-label={`Remove set ${i + 1}`}
                >
                  <MinusCircleIcon />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addSet}
          aria-label="Add set"
        >
          <Plus />
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
