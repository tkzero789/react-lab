"use client"

import { useState } from "react"
import { CalendarPlusIcon } from "lucide-react"
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
import Loader from "@/components/ui/loader"
import { Button } from "@/components/ui/button"

type Tab = "workout" | "exercises"

export default function WorkoutPage() {
  const [tab, setTab] = useState<Tab>("workout")
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [dayDialogOpen, setDayDialogOpen] = useState(false)

  function openToday() {
    setSelectedDate(new Date())
    setDayDialogOpen(true)
  }

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Apps", href: pathClient("/apps") },
          { title: "Workout" },
        ]}
      />
      <DashboardContainer className="p-0">
        <Unauthenticated>
          <SignInPrompt description="Track your exercises and workouts" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          <Tabs
            value={tab}
            onValueChange={(value: Tab) => setTab(value)}
            className="flex-1"
          >
            <TabsListWrapper className="justify-between px-4 pt-4">
              <TabsList>
                <TabsTrigger value="workout" className="flex-1">
                  Workout
                </TabsTrigger>
                <TabsTrigger value="exercises" className="flex-1">
                  Exercises
                </TabsTrigger>
              </TabsList>
              {tab === "workout" ? (
                <Button onClick={openToday}>
                  <CalendarPlusIcon data-icon="inline-start" />
                  Log Workout
                </Button>
              ) : (
                <AddExercise />
              )}
            </TabsListWrapper>
            <TabsContent value="workout">
              <WorkoutLogger
                selectedDate={selectedDate}
                onSelectedDateChange={setSelectedDate}
                dayDialogOpen={dayDialogOpen}
                onDayDialogOpenChange={setDayDialogOpen}
              />
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
