"use client"

/* Form that saves changes to an exercise */

import React from "react"
import { useMutation } from "convex/react"
import { FunctionReturnType } from "convex/server"
import { api } from "@/convex/_generated/api"
import { useUploadFile } from "@/hooks/use-upload-file"
import { toast } from "@/lib/toast"
import ExerciseForm, { ExerciseFormValues } from "./exercise-form"

export type Exercise = FunctionReturnType<typeof api.exercises.list>[number]

type Props = {
  exercise: Exercise
  onSaved: () => void
}

export default function UpdateExerciseForm({ exercise, onSaved }: Props) {
  const updateExercise = useMutation(api.exercises.update)
  const uploadFile = useUploadFile()
  const [isPending, startTransition] = React.useTransition()

  function handleUpdate({ thumbnail, ...data }: ExerciseFormValues) {
    startTransition(async () => {
      try {
        const storageId =
          thumbnail instanceof File ? await uploadFile(thumbnail) : thumbnail
        await updateExercise({
          id: exercise._id,
          ...data,
          thumbnail: storageId,
        })
        onSaved()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save exercise"
        )
      }
    })
  }

  return (
    <ExerciseForm
      defaultValues={{
        name: exercise.name,
        muscleGroups: exercise.muscleGroups,
        personalBest: exercise.personalBest,
        thumbnailUrl: exercise.thumbnailUrl,
      }}
      onSubmit={handleUpdate}
      submitLabel="Save Changes"
      isPending={isPending}
    />
  )
}
