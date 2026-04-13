"use client";

import React from "react";
import { toast } from "sonner";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ExerciseList from "./components/exercise-list";
import WorkoutLogger from "./components/workout-logger";
import SignInPrompt from "../components/sign-in-prompt";
import { Skeleton } from "@/components/ui/skeleton";
import Dock from "../components/dock";
import ExerciseForm from "./components/exercise-form";

export default function WorkoutPage() {
  const isMobile = useIsMobile();
  const { isLoading, isAuthenticated } = useConvexAuth();

  const exercises =
    useQuery(api.exercises.list, isAuthenticated ? {} : "skip") ?? [];
  const workoutLogs =
    useQuery(api.workoutLogs.list, isAuthenticated ? {} : "skip") ?? [];

  const addExercise = useMutation(api.exercises.add);
  const updateExercise = useMutation(api.exercises.update);
  const removeExercise = useMutation(api.exercises.remove);
  const addWorkoutLog = useMutation(api.workoutLogs.add);
  const removeWorkoutLog = useMutation(api.workoutLogs.remove);

  const [exerciseDialogOpen, setExerciseDialogOpen] = React.useState(false);
  const toastPos = isMobile ? "top-center" : ("bottom-right" as const);

  function handleAddExercise(data: {
    name: string;
    muscleGroups: string[];
    personalBest: number;
  }) {
    addExercise(data);
    setExerciseDialogOpen(false);
    toast.success(`Added "${data.name}"`, { position: toastPos });
  }

  function handleUpdateExercise(
    id: Id<"exercises">,
    data: { name: string; muscleGroups: string[]; personalBest: number },
  ) {
    updateExercise({ id, ...data });
    toast.success("Exercise updated", { position: toastPos });
  }

  function handleRemoveExercise(id: Id<"exercises">) {
    removeExercise({ id });
    toast.info("Exercise deleted", { position: toastPos });
  }

  function handleAddWorkout(
    date: string,
    exerciseId: Id<"exercises">,
    sets: { reps: number; weight: number }[],
  ) {
    addWorkoutLog({ date, exerciseId, sets });
    toast.success("Workout logged", { position: toastPos });
  }

  function handleRemoveWorkout(id: Id<"workoutLogs">) {
    removeWorkoutLog({ id });
    toast.info("Workout entry deleted", { position: toastPos });
  }

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[{ title: "Apps", href: "/apps" }, { title: "Workout" }]}
      />
      <DashboardContainer className="flex max-w-3xl flex-1 flex-col p-0">
        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-64" />
          </div>
        )}
        {!isAuthenticated && !isLoading && (
          <SignInPrompt description="Sign in to track your exercises, body weight, and workouts." />
        )}
        {isAuthenticated && (
          <Tabs defaultValue="workout" className="flex-1">
            <TabsList className="w-full" wrapperClassName="px-4 pt-4">
              <TabsTrigger value="workout" className="flex-1">
                Workout
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex-1">
                Exercises
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout">
              <WorkoutLogger
                exercises={exercises}
                logs={workoutLogs}
                onAdd={handleAddWorkout}
                onRemove={handleRemoveWorkout}
              />
            </TabsContent>

            <TabsContent value="exercises" className="flex flex-1 flex-col">
              <ExerciseList
                exercises={exercises}
                onUpdate={handleUpdateExercise}
                onRemove={handleRemoveExercise}
              />
              <Dock>
                <Dialog
                  open={exerciseDialogOpen}
                  onOpenChange={setExerciseDialogOpen}
                >
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
                      <ExerciseForm onSubmit={handleAddExercise} />
                    </DialogBody>
                  </DialogContent>
                </Dialog>
              </Dock>
            </TabsContent>
          </Tabs>
        )}
      </DashboardContainer>
    </>
  );
}
