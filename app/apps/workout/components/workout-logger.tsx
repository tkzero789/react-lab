"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Minus,
  Dumbbell,
  X,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

type Exercise = {
  _id: Id<"exercises">;
  name: string;
  muscleGroups: string[];
  personalBest: number;
};

type WorkoutLog = {
  _id: Id<"workoutLogs">;
  date: string;
  exerciseId: Id<"exercises">;
  sets: { reps: number; weight: number }[];
};

type Props = {
  exercises: Exercise[];
  logs: WorkoutLog[];
  onAdd: (
    date: string,
    exerciseId: Id<"exercises">,
    sets: { reps: number; weight: number }[],
  ) => void;
  onRemove: (id: Id<"workoutLogs">) => void;
};

export default function WorkoutLogger({
  exercises,
  logs,
  onAdd,
  onRemove,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Id<"exercises"> | "">(
    "",
  );
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([
    { reps: "", weight: "" },
  ]);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayLogs = logs.filter((l) => l.date === dateStr);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekLogs = logs.filter((l) => {
    const d = new Date(l.date + "T00:00:00");
    return isWithinInterval(d, { start: weekStart, end: weekEnd });
  });

  const datesWithLogs = Array.from(new Set(logs.map((l) => l.date))).map(
    (d) => new Date(d + "T00:00:00"),
  );

  const dayTotalSets = dayLogs.reduce((sum, l) => sum + l.sets.length, 0);
  const weekTotalSets = weekLogs.reduce((sum, l) => sum + l.sets.length, 0);

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

  function handleSubmit(e: React.FormEvent) {
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
    setDialogOpen(false);
    setSelectedExercise("");
    setSets([{ reps: "", weight: "" }]);
  }

  function getExercise(id: Id<"exercises">) {
    return exercises.find((e) => e._id === id);
  }

  function getWeightComparison(exerciseId: Id<"exercises">, weight: number) {
    const exercise = getExercise(exerciseId);
    if (!exercise || exercise.personalBest === 0) return null;
    const diff = weight - exercise.personalBest;
    if (diff > 0)
      return (
        <span className="flex items-center gap-0.5 text-xs text-green-600">
          <ArrowUp className="h-3 w-3" />
          New PR! +{diff} lbs
        </span>
      );
    if (diff < 0)
      return (
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
          <ArrowDown className="h-3 w-3" />
          {diff} lbs from PB
        </span>
      );
    return (
      <span className="flex items-center gap-0.5 text-xs text-blue-600">
        <Minus className="h-3 w-3" />
        At PB
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="shrink-0">
        <CardContent className="flex flex-col items-center gap-3 pt-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            modifiers={{ logged: datesWithLogs }}
            modifiersClassNames={{
              logged:
                "!bg-primary/15 !text-primary !font-semibold rounded-md",
            }}
          />
          <div className="flex w-full gap-2 text-center text-sm">
            <div className="flex-1 rounded-md bg-muted/50 p-2">
              <p className="text-lg font-semibold">{dayTotalSets}</p>
              <p className="text-xs text-muted-foreground">Sets Today</p>
            </div>
            <div className="flex-1 rounded-md bg-muted/50 p-2">
              <p className="text-lg font-semibold">{weekTotalSets}</p>
              <p className="text-xs text-muted-foreground">Sets This Week</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={exercises.length === 0}>
                <Plus className="mr-1 h-4 w-4" />
                Log Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Log Exercise — {format(selectedDate, "MMM d, yyyy")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Exercise
                  </label>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={selectedExercise}
                    onChange={(e) =>
                      setSelectedExercise(
                        e.target.value as Id<"exercises"> | "",
                      )
                    }
                  >
                    <option value="">Select an exercise</option>
                    {exercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name}{" "}
                        {ex.personalBest > 0
                          ? `(PB: ${ex.personalBest} lbs)`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Sets</label>
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
                          onChange={(e) =>
                            updateSet(i, "weight", e.target.value)
                          }
                          className="flex-1"
                        />
                        {sets.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => removeSet(i)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addSet}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Set
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={
                    !selectedExercise ||
                    !sets.some((s) => s.reps && s.weight)
                  }
                >
                  <Dumbbell className="mr-1 h-4 w-4" />
                  Save Workout
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {exercises.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Add exercises in the Exercises tab first.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayLogs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No exercises logged for this day.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {dayLogs.map((log) => {
                const exercise = getExercise(log.exerciseId);
                const maxWeight = Math.max(...log.sets.map((s) => s.weight));
                return (
                  <div
                    key={log._id}
                    className="rounded-lg border p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {exercise?.name ?? "Unknown"}
                        </span>
                        {getWeightComparison(log.exerciseId, maxWeight)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onRemove(log._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {log.sets.map((set, i) => (
                        <Badge key={i} variant="secondary">
                          Set {i + 1}: {set.reps} reps × {set.weight} lbs
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
