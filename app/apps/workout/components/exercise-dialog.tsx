"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Dock from "../../components/dock";
import ExerciseForm from "./exercise-form";

export default function ExerciseDialog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const addExercise = useMutation(api.exercises.add);

  function handleAdd(data: {
    name: string;
    muscleGroups: string[];
    personalBest: number;
  }) {
    addExercise(data);
    setOpen(false);
    toast.success(`Added "${data.name}"`, {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

  return (
    <Dock>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="bg-background p-4">
            <Button className="w-full">Add Exercise</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
          </DialogHeader>
          <DialogBody className="flex flex-1 flex-col p-0">
            <ExerciseForm onSubmit={handleAdd} />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </Dock>
  );
}
