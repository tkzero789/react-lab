"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  getDay,
  isWithinInterval,
} from "date-fns"
import { enUS } from "date-fns/locale"
import LogExerciseForm from "./log-exercise-form"
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type Event,
  type ToolbarProps,
} from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
})

type WorkoutEvent = Event & {
  logId: Id<"workoutLogs">
  exerciseId: Id<"exercises">
  dateStr: string
}

function CalendarNavigation({
  label,
  onNavigate,
}: ToolbarProps<WorkoutEvent, object>) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <span className="text-base font-semibold">{label}</span>
      <ButtonGroup>
        <Button
          variant="muted"
          size="icon-sm"
          onClick={() => onNavigate("PREV")}
          aria-label="Previous"
        >
          <ChevronLeft />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="muted" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <ButtonGroupSeparator />
        <Button
          variant="muted"
          size="icon-sm"
          onClick={() => onNavigate("NEXT")}
          aria-label="Next"
        >
          <ChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default function WorkoutLogger() {
  const exercises = useQuery(api.exercises.list) ?? []
  const logs = useQuery(api.workoutLogs.list) ?? []
  const addWorkoutLog = useMutation(api.workoutLogs.add)
  const removeWorkoutLog = useMutation(api.workoutLogs.remove)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dayDialogOpen, setDayDialogOpen] = useState(false)
  const [logDialogOpen, setLogDialogOpen] = useState(false)

  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const dayLogs = logs.filter((l) => l.date === dateStr)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekLogs = logs.filter((l) => {
    const d = new Date(l.date + "T00:00:00")
    return isWithinInterval(d, { start: weekStart, end: weekEnd })
  })

  const dayTotalSets = dayLogs.reduce((sum, l) => sum + l.sets.length, 0)
  const weekTotalSets = weekLogs.reduce((sum, l) => sum + l.sets.length, 0)

  const events: WorkoutEvent[] = logs.map((l) => {
    const exercise = exercises.find((e) => e._id === l.exerciseId)
    const d = new Date(l.date + "T00:00:00")
    return {
      logId: l._id,
      exerciseId: l.exerciseId,
      dateStr: l.date,
      title: exercise?.name ?? "Unknown",
      start: d,
      end: d,
      allDay: true,
    }
  })

  function getExercise(id: Id<"exercises">) {
    return exercises.find((e) => e._id === id)
  }

  function handleAdd(
    date: string,
    exerciseId: Id<"exercises">,
    sets: { reps: number; weight: number }[]
  ) {
    addWorkoutLog({ date, exerciseId, sets })
  }

  function handleRemove(id: Id<"workoutLogs">) {
    removeWorkoutLog({ id })
  }

  function openDayDialog(date: Date) {
    setSelectedDate(date)
    setDayDialogOpen(true)
  }

  function getWeightComparison(exerciseId: Id<"exercises">, weight: number) {
    const exercise = getExercise(exerciseId)
    if (!exercise || exercise.personalBest === 0) return null
    const diff = weight - exercise.personalBest
    if (diff > 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <ArrowUp className="size-4" />
          New PR +{diff} lbs
        </span>
      )
    if (diff < 0)
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <ArrowDown className="size-4" />
          {diff} lbs from PB
        </span>
      )
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-primary">
        At PB
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex gap-2 text-center text-sm">
        <div className="flex-1 rounded-xl border p-3">
          <p className="text-lg font-semibold">{dayTotalSets}</p>
          <p className="text-xs text-muted-foreground">
            Sets on {format(selectedDate, "MMM d")}
          </p>
        </div>
        <div className="flex-1 rounded-xl border p-3">
          <p className="text-lg font-semibold">{weekTotalSets}</p>
          <p className="text-xs text-muted-foreground">Sets This Week</p>
        </div>
      </div>

      <BigCalendar<WorkoutEvent>
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH]}
        date={selectedDate}
        onNavigate={(d) => setSelectedDate(d)}
        selectable
        onSelectSlot={(slot) => openDayDialog(slot.start as Date)}
        onSelectEvent={(event) => {
          const d = (event.start as Date) ?? new Date()
          openDayDialog(d)
        }}
        onDrillDown={(d) => openDayDialog(d)}
        popup
        style={{ height: 600 }}
        components={{
          toolbar: CalendarNavigation,
          event: ({ event }) => (
            <div className="">
              <span className="hidden truncate text-xs lg:block">
                {event.title}
              </span>
              <span className="read-only invisible truncate text-xs opacity-0 lg:hidden">
                Exercise item
              </span>
            </div>
          ),
        }}
      />

      {/* Day details dialog */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {format(selectedDate, "EEEE, MMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            {dayLogs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No exercises logged for this day.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {dayLogs.map((log) => {
                  const exercise = getExercise(log.exerciseId)
                  const maxWeight = Math.max(...log.sets.map((s) => s.weight))
                  return (
                    <div
                      key={log._id}
                      className="flex flex-col gap-2 rounded-xl border bg-card p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {exercise?.name ?? "Unknown"}
                          </span>
                          {getWeightComparison(log.exerciseId, maxWeight)}
                        </div>
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button
                                variant="ghost-destructive"
                                size="icon-sm"
                              >
                                <Trash2 />
                              </Button>
                            }
                          ></DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete workout</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                              Remove{" "}
                              <span className="font-medium">
                                {exercise?.name}
                              </span>{" "}
                              from {format(selectedDate, "EEEE, MMM d, yyyy")}
                            </DialogBody>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemove(log._id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
                  )
                })}
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
              <DialogTrigger
                render={
                  <Button disabled={exercises.length === 0}>
                    Log Exercise
                  </Button>
                }
              ></DialogTrigger>
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
                    onAdd={handleAdd}
                    onClose={() => setLogDialogOpen(false)}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button form="logWorkout" type="submit">
                    Save Workout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
