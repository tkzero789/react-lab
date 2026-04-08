"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";

type Exercise = {
  _id: Id<"exercises">;
  name: string;
  muscleGroups: string[];
  personalBest: number;
};

type Props = {
  exercises: Exercise[];
  dateStr: string;
  onAdd: (
    date: string,
    exerciseId: Id<"exercises">,
    sets: { reps: number; weight: number }[],
  ) => void;
  onClose: () => void;
};

export default function LogExerciseForm({
  exercises,
  dateStr,
  onAdd,
  onClose,
}: Props) {
  const [selectedExercise, setSelectedExercise] = useState<
    Id<"exercises"> | ""
  >("");
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([
    { reps: "", weight: "" },
  ]);

  function addSet() {
    setSets([...sets, { reps: "", weight: "" }]);
  }

  function removeSet(index: number) {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, i) => i !== index));
  }

  function updateSet(index: number, field: "reps" | "weight", value: string) {
    setSets(sets.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedExercise) return;
    const parsedSets = sets
      .filter((s) => s.reps && s.weight)
      .map((s) => ({
        reps: parseInt(s.reps),
        weight: parseFloat(s.weight),
      }));
    if (parsedSets.length === 0) return;
    onAdd(dateStr, selectedExercise, parsedSets);
    onClose();
    setSelectedExercise("");
    setSets([{ reps: "", weight: "" }]);
  }

  return (
    <form
      id="logWorkout"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* Exercises */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Exercise</label>
        <Select
          value={selectedExercise || undefined}
          onValueChange={(value) =>
            setSelectedExercise(value as Id<"exercises">)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an exercise" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {exercises.map((ex) => (
                <SelectItem key={ex._id} value={ex._id}>
                  {ex.name}{" "}
                  {ex.personalBest > 0 ? `(PB: ${ex.personalBest} lbs)` : ""}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeSet(i)}
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="muted"
          className="w-full"
          onClick={addSet}
        >
          <Plus />
          Add Set
        </Button>
      </div>
    </form>
  );
}
