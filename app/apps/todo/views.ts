/* Views of the todo app and the todos that each view shows */

import { Id } from "@/convex/_generated/dataModel"
import { differenceInCalendarDays } from "date-fns"
import { CalendarDaysIcon, InboxIcon, SunIcon } from "lucide-react"
import { List, Todo } from "./types"

export const VIEWS = [
  { id: "today", label: "Today", icon: SunIcon },
  { id: "week", label: "This week", icon: CalendarDaysIcon },
  { id: "all", label: "All todos", icon: InboxIcon },
] as const

export type BuiltInView = (typeof VIEWS)[number]["id"]

export type View = BuiltInView | Id<"todoLists">

export const DEFAULT_VIEW: BuiltInView = "today"

/* Days after today that each date view includes */
const LAST_DAY = { today: 0, week: 6 }

function isBuiltInView(value: string): value is BuiltInView {
  return VIEWS.some((view) => view.id === value)
}

/* A list ID is a branded string, so a plain comparison does not narrow the view type */
function isDateView(view: View): view is keyof typeof LAST_DAY {
  return view in LAST_DAY
}

/* A deleted list or a bad URL falls back to the default view */
export function parseView(value: string | null, lists: List[]): View {
  if (!value) return DEFAULT_VIEW
  if (isBuiltInView(value)) return value
  return lists.find((list) => list._id === value)?._id ?? DEFAULT_VIEW
}

export function isInView(todo: Todo, view: View) {
  if (view === "all") return true
  if (!isDateView(view)) return todo.listId === view

  /* Date 0 means no due date */
  if (!todo.date) return false
  const offset = differenceInCalendarDays(todo.date, Date.now())

  /* An open overdue todo stays in view until it is done. A completed one leaves with its date. */
  return (
    offset <= LAST_DAY[view] && (todo.status !== "completed" || offset >= 0)
  )
}
