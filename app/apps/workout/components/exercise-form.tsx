"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Plus, X } from "lucide-react";
import { MUSCLE_GROUPS, MuscleGroup } from "@/types/workout";

type Props = {
  onSubmit: (data: {
    name: string;
    muscleGroups: string[];
    personalBest: number;
  }) => void;
  initial?: { name: string; muscleGroups: string[]; personalBest: number };
  submitLabel?: string;
};

export default function ExerciseForm({
  onSubmit,
  initial,
  submitLabel = "Add Exercise",
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [personalBest, setPersonalBest] = useState(
    initial?.personalBest?.toString() ?? "",
  );
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(
    (initial?.muscleGroups as MuscleGroup[]) ?? [],
  );

  function toggleMuscle(muscle: MuscleGroup) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selectedMuscles.length === 0) return;
    onSubmit({
      name: name.trim(),
      muscleGroups: selectedMuscles,
      personalBest: parseFloat(personalBest) || 0,
    });
    if (!initial) {
      setName("");
      setPersonalBest("");
      setSelectedMuscles([]);
    }
  }

  return (
    <form
      id="addExercise"
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-col gap-4 p-4">
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
          disabled={!name.trim() || selectedMuscles.length === 0}
          className="w-full"
        >
          <Plus />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
