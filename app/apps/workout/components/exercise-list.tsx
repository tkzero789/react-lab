"use client"

/* Searchable exercise library with personal best and last session */

import React from "react"
import type { FunctionReturnType } from "convex/server"
import { useMutation, useQuery } from "convex/react"
import { differenceInCalendarDays, format, parseISO } from "date-fns"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Loader from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { MUSCLE_GROUPS } from "@/types/workout"
import { formatSet, formatWeight, getTopSet } from "../lib/sets"
import ExerciseActions from "./exercise-actions"
import ExerciseThumbnail from "./exercise-thumbnail"

type Log = Doc<"workoutLogs">
type Exercise = FunctionReturnType<typeof api.exercises.list>[number]

type ExerciseStats = {
  last: Log
  bestWeight: number
}

const ALL = "All"

function getStatsByExercise(logs: Log[]) {
  const stats = new Map<Id<"exercises">, ExerciseStats>()
  for (const log of logs) {
    const current = stats.get(log.exerciseId)
    stats.set(log.exerciseId, {
      /* ISO date strings sort in date order, so a string compare is safe */
      last: !current || log.date > current.last.date ? log : current.last,
      bestWeight: Math.max(
        current?.bestWeight ?? 0,
        getTopSet(log.sets)?.weight ?? 0
      ),
    })
  }
  return stats
}

function formatDaysAgo(date: string) {
  const days = differenceInCalendarDays(new Date(), parseISO(date))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days > 1 && days < 7) return `${days}d ago`
  return format(parseISO(date), "MMM d")
}

function ExerciseCard({
  exercise,
  stats,
  onRemove,
}: {
  exercise: Exercise
  stats: ExerciseStats | undefined
  onRemove: () => void
}) {
  /* The stored personalBest is a manual baseline. Logged sets can exceed it. */
  const personalBest = Math.max(exercise.personalBest, stats?.bestWeight ?? 0)
  const lastTopSet = stats && getTopSet(stats.last.sets)

  return (
    <Card>
      <div className="flex items-start gap-3 p-4">
        <ExerciseThumbnail src={exercise.thumbnailUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="truncate font-medium">{exercise.name}</div>
          {exercise.muscleGroups.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {exercise.muscleGroups.map((mg) => (
                <Badge key={mg} variant="secondary">
                  {mg}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <ExerciseActions exercise={exercise} onRemove={onRemove} />
      </div>

      <div className="flex items-center gap-2 border-t px-4 py-2 text-xs text-muted-foreground tabular-nums">
        {personalBest > 0 && (
          <span className="font-medium text-foreground">
            PB {formatWeight(personalBest)}
          </span>
        )}
        <span className="ml-auto">
          {stats ? (
            <>
              {lastTopSet && `Last ${formatSet(lastTopSet)} · `}
              {formatDaysAgo(stats.last.date)}
            </>
          ) : (
            "Not logged yet"
          )}
        </span>
      </div>
    </Card>
  )
}

export default function ExerciseList() {
  const exercises = useQuery(api.exercises.list)
  const logs = useQuery(api.workoutLogs.list)
  const removeExercise = useMutation(api.exercises.remove)

  const [search, setSearch] = React.useState<string>("")
  const [muscle, setMuscle] = React.useState<string>(ALL)

  if (exercises === undefined || logs === undefined) return <Loader />

  const statsByExercise = getStatsByExercise(logs)
  const query = search.trim().toLowerCase()
  const filtered = exercises.filter((e) => {
    const matchesName = query ? e.name.toLowerCase().includes(query) : true
    const matchesMuscle =
      muscle === ALL ? true : e.muscleGroups.includes(muscle)
    return matchesName && matchesMuscle
  })

  return (
    <div className="flex flex-1 flex-col gap-3 px-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Search exercises"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select
          value={muscle}
          onValueChange={(value) => {
            if (value) {
              setMuscle(value)
            }
          }}
        >
          <SelectTrigger className="w-full lg:w-1/5">
            <SelectValue placeholder="Muscle" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>All muscles</SelectItem>
              {MUSCLE_GROUPS.map((mg) => (
                <SelectItem key={mg} value={mg}>
                  {mg}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {exercises.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises yet. Add one to get started.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises match your filters.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              stats={statsByExercise.get(exercise._id)}
              onRemove={() => removeExercise({ id: exercise._id })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
