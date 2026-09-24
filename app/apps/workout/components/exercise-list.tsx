"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MUSCLE_GROUPS } from "@/types/workout"
import ExerciseActions from "./exercise-actions"
import ExerciseThumbnail from "./exercise-thumbnail"

const ALL = "All"

export default function ExerciseList() {
  const exercises = useQuery(api.exercises.list) ?? []
  const removeExercise = useMutation(api.exercises.remove)

  const [search, setSearch] = React.useState<string>("")
  const [muscle, setMuscle] = React.useState<string>(ALL)

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
          onValueChange={(e) => {
            if (e) {
              setMuscle(e)
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
          No exercises yet. Add one below to get started.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises match your filters.
        </p>
      ) : (
        <div className="grid gap-2 lg:grid-cols-3">
          {filtered.map((exercise) => (
            <Card key={exercise._id}>
              <CardContent className="p-0">
                {/* Details */}
                <div className="flex gap-3 px-4 pt-4 pb-2">
                  <ExerciseThumbnail src={exercise.thumbnailUrl} />
                  <div className="flex flex-1 justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      {/* Name */}
                      <div className="font-medium">{exercise.name}</div>
                      {/* Target muscles */}
                      <div className="flex flex-wrap items-center gap-2">
                        {exercise.muscleGroups.map((mg) => (
                          <Badge key={mg} variant="secondary" className="w-fit">
                            {mg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* PB */}
                    {exercise.personalBest > 0 && (
                      <div className="flex flex-col items-end">
                        <div className="text-xl font-bold tracking-tighter">
                          {exercise.personalBest}
                        </div>{" "}
                        <span className="inline-block text-sm text-muted-foreground">
                          LBS
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-1 border-t px-4 pt-2 pb-4">
                  <ExerciseActions
                    exercise={exercise}
                    onRemove={() => removeExercise({ id: exercise._id })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
