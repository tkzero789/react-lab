"use client"

import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { pathClient } from "@/lib/path-client"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsListWrapper,
  TabsTrigger,
} from "@/components/ui/tabs"
import SignInPrompt from "../components/sign-in-prompt"
import ExerciseList from "./components/exercise-list"
import AddExercise from "./components/add-exercise"
import WorkoutLogger from "./components/workout-logger"

export default function WorkoutPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Apps", href: pathClient("/apps") },
          { title: "Workout" },
        ]}
      />
      <DashboardContainer className="flex flex-1 flex-col p-0">
        <Unauthenticated>
          <SignInPrompt description="Sign in to track your exercises and workouts." />
        </Unauthenticated>
        <Authenticated>
          <Tabs defaultValue="workout" className="flex-1">
            <TabsListWrapper className="justify-between px-4 pt-4">
              <TabsList>
                <TabsTrigger value="workout" className="flex-1">
                  Workout
                </TabsTrigger>
                <TabsTrigger value="exercises" className="flex-1">
                  Exercises
                </TabsTrigger>
              </TabsList>
              <AddExercise />
            </TabsListWrapper>
            <TabsContent value="workout">
              <WorkoutLogger />
            </TabsContent>
            <TabsContent value="exercises" className="flex flex-1 flex-col">
              <ExerciseList />
            </TabsContent>
          </Tabs>
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
