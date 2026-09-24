"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useFileUpload } from "@/app/hooks/use-file-upload"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

import { X } from "lucide-react"
import { MUSCLE_GROUPS, MuscleGroup } from "@/types/workout"
import ExerciseThumbnail from "./exercise-thumbnail"

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024

export type ExerciseFormValues = {
  name: string
  muscleGroups: string[]
  personalBest: number
  /* undefined keeps the current image. null removes it. */
  thumbnail?: File | null
}

type Props = {
  onSubmit: (data: ExerciseFormValues) => void
  defaultValues?: Omit<ExerciseFormValues, "thumbnail"> & {
    thumbnailUrl?: string | null
  }
  submitLabel?: string
  isPending?: boolean
}

export default function ExerciseForm({
  onSubmit,
  defaultValues,
  submitLabel,
  isPending = false,
}: Props) {
  const [name, setName] = useState(defaultValues?.name ?? "")
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(
    (defaultValues?.muscleGroups as MuscleGroup[]) ?? []
  )
  const [personalBest, setPersonalBest] = useState(
    defaultValues?.personalBest?.toString() ?? ""
  )

  const initialThumbnailUrl = defaultValues?.thumbnailUrl
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize: MAX_THUMBNAIL_SIZE,
    initialFiles: initialThumbnailUrl
      ? [
          {
            id: "current",
            url: initialThumbnailUrl,
            name: "thumbnail",
            size: 0,
            type: "image/*",
          },
        ]
      : [],
    onError: (errors) => {
      for (const error of errors) toast.error(error)
    },
  })
  const thumbnail = files[0]

  function toggleMuscle(muscle: MuscleGroup) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    )
  }

  function getThumbnailChange() {
    if (thumbnail?.file instanceof File) return thumbnail.file
    if (!thumbnail && initialThumbnailUrl) return null
    return undefined
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || selectedMuscles.length === 0) return
    onSubmit({
      name: name.trim(),
      muscleGroups: selectedMuscles,
      personalBest: parseFloat(personalBest) || 0,
      thumbnail: getThumbnailChange(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4">
        <div>
          <span className="mb-1 block text-sm font-medium">Thumbnail</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={thumbnail ? "Change thumbnail" : "Upload thumbnail"}
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "pressable rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isDragging && "ring-2 ring-ring"
              )}
            >
              <ExerciseThumbnail src={thumbnail?.preview} size={80} />
            </button>
            <input {...getInputProps()} className="hidden" />
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                >
                  {thumbnail ? "Change" : "Upload"}
                </Button>
                {thumbnail && (
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="sm"
                    onClick={() => removeFile(thumbnail.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Optional. An image up to 5 MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Exercise Name
          </label>
          <Input
            placeholder="e.g. Bench Press"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Muscle Groups
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((muscle) => (
              <Badge
                key={muscle}
                variant={
                  selectedMuscles.includes(muscle) ? "default" : "outline"
                }
                className="cursor-pointer select-none"
                onClick={() => toggleMuscle(muscle)}
              >
                {selectedMuscles.includes(muscle) && (
                  <X className="mr-0.5 h-3 w-3" />
                )}
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Personal Best (lbs)
          </label>
          <Input
            type="number"
            placeholder="0"
            min="0"
            step="0.5"
            value={personalBest}
            onChange={(e) => setPersonalBest(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-auto border-t p-4">
        <Button
          type="submit"
          disabled={isPending || !name.trim() || selectedMuscles.length === 0}
          className="w-full"
        >
          {isPending && <Spinner />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
