"use client";

import React from "react";
import { toast } from "sonner";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
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
import BodyWeightTracker from "./components/body-weight-tracker";
import WorkoutLogger from "./components/workout-logger";
import AddExerciseForm from "./components/add-exercise-form";
import SignInPrompt from "../components/sign-in-prompt";

export default function WorkoutPage() {
  const isMobile = useIsMobile();
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const exercises =
    useQuery(api.exercises.list, isAuthenticated ? {} : "skip") ?? [];
  const bodyWeights =
    useQuery(api.bodyWeights.list, isAuthenticated ? {} : "skip") ?? [];
  const workoutLogs =
    useQuery(api.workoutLogs.list, isAuthenticated ? {} : "skip") ?? [];

  const addExercise = useMutation(api.exercises.add);
  const updateExercise = useMutation(api.exercises.update);
  const removeExercise = useMutation(api.exercises.remove);
  const upsertBodyWeight = useMutation(api.bodyWeights.upsert);
  const removeBodyWeight = useMutation(api.bodyWeights.remove);
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

  function handleUpsertWeight(date: string, weight: number) {
    upsertBodyWeight({ date, weight });
    toast.success("Weight logged", { position: toastPos });
  }

  function handleRemoveWeight(id: Id<"bodyWeights">) {
    removeBodyWeight({ id });
    toast.info("Entry deleted", { position: toastPos });
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
      <DashboardContainer className="max-w-4xl flex-1">
        {!isAuthenticated ? (
          <SignInPrompt description="Sign in to track your exercises, body weight, and workouts." />
        ) : (
          <Tabs defaultValue="workout">
            <TabsList className="w-full">
              <TabsTrigger value="workout" className="flex-1">
                Workout
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex-1">
                Exercises
              </TabsTrigger>
              <TabsTrigger value="weight" className="flex-1">
                Body Weight
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

            <TabsContent value="exercises">
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Dialog
                    open={exerciseDialogOpen}
                    onOpenChange={setExerciseDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>Add Exercise</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Exercise</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        <AddExerciseForm onSubmit={handleAddExercise} />
                      </DialogBody>
                    </DialogContent>
                  </Dialog>
                </div>
                <ExerciseList
                  exercises={exercises}
                  onUpdate={handleUpdateExercise}
                  onRemove={handleRemoveExercise}
                />
              </div>
            </TabsContent>

            <TabsContent value="weight">
              <BodyWeightTracker
                entries={bodyWeights}
                onUpsert={handleUpsertWeight}
                onRemove={handleRemoveWeight}
              />
            </TabsContent>
          </Tabs>
        )}
      </DashboardContainer>
    </>
  );
}
