"use client";

import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import { Authenticated, Unauthenticated } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInPrompt from "../components/sign-in-prompt";
import ExerciseList from "./components/exercise-list";
import ExerciseDialog from "./components/exercise-dialog";
import WorkoutLogger from "./components/workout-logger";

export default function WorkoutPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Apps", href: pathClient("/apps") },
          { title: "Workout" },
        ]}
      />
      <DashboardContainer className="flex max-w-3xl flex-1 flex-col p-0">
        <Unauthenticated>
          <SignInPrompt description="Sign in to track your exercises and workouts." />
        </Unauthenticated>
        <Authenticated>
          <Tabs defaultValue="workout" className="flex-1">
            <TabsList className="w-full" wrapperClassName="lg:px-0 px-4 pt-4">
              <TabsTrigger value="workout" className="flex-1">
                Workout
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex-1">
                Exercises
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout">
              <WorkoutLogger />
            </TabsContent>

            <TabsContent value="exercises" className="flex flex-1 flex-col">
              <ExerciseList />
              <ExerciseDialog />
            </TabsContent>
          </Tabs>
        </Authenticated>
      </DashboardContainer>
    </>
  );
}
