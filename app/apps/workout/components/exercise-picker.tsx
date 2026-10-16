"use client"

/* Searchable exercise list with thumbnails for the log flow */

import React from "react"
import type { FunctionReturnType } from "convex/server"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatWeight } from "../lib/sets"
import ExerciseThumbnail from "./exercise-thumbnail"

export type Exercise = FunctionReturnType<typeof api.exercises.list>[number]

type Props = {
  exercises: Exercise[]
  loggedExerciseIds: Set<Id<"exercises">>
  onSelect: (exercise: Exercise) => void
}

/* Match by substring. The item value is an ID, so fuzzy match on it gives noise. */
function filterExercises(_value: string, search: string, keywords?: string[]) {
  const query = search.trim().toLowerCase()
  return keywords?.some((k) => k.toLowerCase().includes(query)) ? 1 : 0
}

export function ExerciseInfo({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="truncate font-medium">{exercise.name}</span>
      {exercise.muscleGroups.length > 0 && (
        <span className="truncate text-xs font-normal text-muted-foreground">
          {exercise.muscleGroups.join(", ")}
        </span>
      )}
    </div>
  )
}

export default function ExercisePicker({
  exercises,
  loggedExerciseIds,
  onSelect,
}: Props) {
  return (
    /* The step has a fixed height, so only the list scrolls */
    <Command filter={filterExercises} className="bg-transparent p-0">
      <div className="pb-2">
        <CommandInput autoFocus placeholder="Search exercises or muscles" />
      </div>
      <CommandList className="max-h-none min-h-0 flex-1">
        <CommandEmpty>No exercises found.</CommandEmpty>
        {exercises.map((exercise) => (
          <CommandItem
            key={exercise._id}
            value={exercise._id}
            keywords={[exercise.name, ...exercise.muscleGroups]}
            onSelect={() => onSelect(exercise)}
            className="gap-3 py-2"
          >
            <ExerciseThumbnail src={exercise.thumbnailUrl} size={44} />
            <ExerciseInfo exercise={exercise} />
            {loggedExerciseIds.has(exercise._id) ? (
              <Badge variant="secondary">Logged</Badge>
            ) : (
              exercise.personalBest > 0 && (
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  PB {formatWeight(exercise.personalBest)}
                </span>
              )
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}
