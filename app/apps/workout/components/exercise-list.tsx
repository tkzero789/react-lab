"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Trophy } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import AddExerciseForm from "./add-exercise-form";

type Exercise = {
  _id: Id<"exercises">;
  name: string;
  muscleGroups: string[];
  personalBest: number;
};

type Props = {
  exercises: Exercise[];
  onUpdate: (
    id: Id<"exercises">,
    data: { name: string; muscleGroups: string[]; personalBest: number },
  ) => void;
  onRemove: (id: Id<"exercises">) => void;
};

export default function ExerciseList({ exercises, onUpdate, onRemove }: Props) {
  const [editId, setEditId] = React.useState<Id<"exercises"> | null>(null);

  if (exercises.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No exercises yet. Add one above to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {exercises.map((exercise) => (
        <Card key={exercise._id}>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{exercise.name}</span>
                {exercise.personalBest > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    {exercise.personalBest} lbs
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {exercise.muscleGroups.map((mg) => (
                  <Badge key={mg} variant="secondary" className="text-xs">
                    {mg}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Dialog
                open={editId === exercise._id}
                onOpenChange={(open) => setEditId(open ? exercise._id : null)}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Exercise</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <AddExerciseForm
                      initial={{
                        name: exercise.name,
                        muscleGroups: exercise.muscleGroups,
                        personalBest: exercise.personalBest,
                      }}
                      submitLabel="Save Changes"
                      onSubmit={(data) => {
                        onUpdate(exercise._id, data);
                        setEditId(null);
                      }}
                    />
                  </DialogBody>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(exercise._id)}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
