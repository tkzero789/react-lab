"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Trash2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import LogExerciseForm from "./log-exercise-form";

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
  const isMobile = useIsMobile();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
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

  function getExercise(id: Id<"exercises">) {
    return exercises.find((e) => e._id === id);
  }

  function getWeightComparison(exerciseId: Id<"exercises">, weight: number) {
    const exercise = getExercise(exerciseId);
    if (!exercise || exercise.personalBest === 0) return null;
    const diff = weight - exercise.personalBest;
    if (diff > 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <ArrowUp className="size-4" />
          New PR +{diff} lbs
        </span>
      );
    if (diff < 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <ArrowDown className="size-4" />
          {diff} lbs from PB
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
        <Minus className="size-4" />
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
              logged: "bg-muted rounded-xl",
            }}
          />
          <div className="flex w-full gap-2 text-center text-sm">
            <div className="flex-1 rounded-xl bg-muted p-2">
              <p className="text-lg font-semibold">{dayTotalSets}</p>
              <p className="text-xs text-muted-foreground">Sets Today</p>
            </div>
            <div className="flex-1 rounded-xl bg-muted p-2">
              <p className="text-lg font-semibold">{weekTotalSets}</p>
              <p className="text-xs text-muted-foreground">Sets This Week</p>
            </div>
          </div>
          {!isMobile ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={exercises.length === 0}>
                  Log Exercise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Log Exercise - {format(selectedDate, "MMM d, yyyy")}
                  </DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <LogExerciseForm
                    exercises={exercises}
                    dateStr={dateStr}
                    onAdd={onAdd}
                    onClose={() => setDialogOpen(false)}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button form="addExercise" type="submit">
                    Save Workout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
              <DrawerTrigger asChild>
                <Button className="w-full" disabled={exercises.length === 0}>
                  Log Exercise
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    Log Exercise - {format(selectedDate, "MMM d, yyyy")}
                  </DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <LogExerciseForm
                    exercises={exercises}
                    dateStr={dateStr}
                    onAdd={onAdd}
                    onClose={() => setDialogOpen(false)}
                  />
                </DrawerBody>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button form="addExercise" type="submit">
                      Save Workout
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}

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
                    className="flex flex-col gap-2 rounded-xl border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {exercise?.name ?? "Unknown"}
                        </span>
                        {getWeightComparison(log.exerciseId, maxWeight)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemove(log._id)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {log.sets.map((set, index) => (
                        <li
                          key={index}
                          className="rounded-xl bg-muted px-2 py-1 text-sm"
                        >
                          Set {index + 1}: {set.reps} reps × {set.weight} lbs
                        </li>
                      ))}
                    </ul>
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
