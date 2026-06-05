"use client"

import React from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import ExerciseForm, { ExerciseFormValues } from "./exercise-form"

export default function AddExercise() {
  const addExercise = useMutation(api.exercises.add)
  const [open, setOpen] = React.useState(false)

  function handleAdd(data: ExerciseFormValues) {
    addExercise(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus />
            Add Exercise
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">
          <ExerciseForm onSubmit={handleAdd} submitLabel="Add Exercise" />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
