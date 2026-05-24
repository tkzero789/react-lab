"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExerciseForm, { ExerciseFormValues } from "./exercise-form";

type Props = {
  exercise: Doc<"exercises">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpdateExercise({
  exercise,
  open,
  onOpenChange,
}: Props) {
  const updateExercise = useMutation(api.exercises.update);

  function handleUpdate(data: ExerciseFormValues) {
    updateExercise({ id: exercise._id, ...data });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">
          <ExerciseForm
            defaultValues={{
              name: exercise.name,
              muscleGroups: exercise.muscleGroups,
              personalBest: exercise.personalBest,
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
