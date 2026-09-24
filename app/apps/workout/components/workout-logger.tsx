"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
import DayDetails from "./day-details"
import { WorkoutSets } from "./log-exercise-form"
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
        <Button variant="muted" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
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
  const updateWorkoutLog = useMutation(api.workoutLogs.update)
  const removeWorkoutLog = useMutation(api.workoutLogs.remove)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dayDialogOpen, setDayDialogOpen] = useState(false)

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

  function handleAdd(
    date: string,
    exerciseId: Id<"exercises">,
    sets: { reps: number; weight: number }[]
  ) {
    addWorkoutLog({ date, exerciseId, sets })
  }

  function handleUpdate(id: Id<"workoutLogs">, sets: WorkoutSets) {
    updateWorkoutLog({ id, sets })
  }

  function handleRemove(id: Id<"workoutLogs">) {
    removeWorkoutLog({ id })
  }

  function openDayDialog(date: Date) {
    setSelectedDate(date)
    setDayDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex gap-2 text-center text-sm">
        <div className="flex-1 rounded-lg border p-3">
          <p className="text-lg font-semibold">{dayTotalSets}</p>
          <p className="text-xs text-muted-foreground">
            Sets on {format(selectedDate, "MMM d")}
          </p>
        </div>
        <div className="flex-1 rounded-lg border p-3">
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
              <span className="hidden truncate text-xs lg:block dark:text-brand-foreground">
                {event.title}
              </span>
              <span className="read-only invisible truncate text-xs opacity-0 lg:hidden">
                Exercise item
              </span>
            </div>
          ),
        }}
      />

      <DayDetails
        open={dayDialogOpen}
        onOpenChange={setDayDialogOpen}
        date={selectedDate}
        logs={dayLogs}
        exercises={exercises}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </div>
  )
}
