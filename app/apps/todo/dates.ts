import { differenceInCalendarDays, format } from "date-fns"

export type DateTone = "late" | "now" | "soon" | "far"
export type DateGroupId = "overdue" | "today" | "tomorrow" | "later" | "undated"

export type DateInfo = {
  label: string
  tone: DateTone
  group: DateGroupId
}

// Rendered in this order; groups with no todos are skipped.
export const DATE_GROUPS = [
  { id: "overdue", label: "Overdue" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "later", label: "Later" },
  { id: "undated", label: "No date" },
] as const satisfies readonly { id: DateGroupId; label: string }[]

/**
 * Turns a timestamp into the label, urgency tone and list group a todo row
 * needs. Returns null for undated todos (`date === 0`).
 */
export function getDateInfo(date: number): DateInfo | null {
  if (!date) return null

  const days = differenceInCalendarDays(date, Date.now())

  if (days < 0) {
    const late = days === -1 ? "1 day late" : `${-days} days late`
    return {
      label: `${format(date, "MMM d")} · ${late}`,
      tone: "late",
      group: "overdue",
    }
  }

  if (days === 0) {
    return { label: "Today", tone: "now", group: "today" }
  }
  if (days === 1) {
    return { label: "Tomorrow", tone: "soon", group: "tomorrow" }
  }

  return {
    label: format(date, "EEE, MMM d"),
    tone: days <= 7 ? "soon" : "far",
    group: "later",
  }
}

/**
 * Buckets todos into `DATE_GROUPS` order, preserving the incoming sort within
 * each group and dropping groups that ended up empty.
 */
export function groupByDate<T extends { date: number }>(todos: T[]) {
  const buckets = new Map<DateGroupId, T[]>()

  for (const todo of todos) {
    const group = getDateInfo(todo.date)?.group ?? "undated"
    const bucket = buckets.get(group)
    if (bucket) bucket.push(todo)
    else buckets.set(group, [todo])
  }

  return DATE_GROUPS.flatMap((group) => {
    const todos = buckets.get(group.id)
    return todos ? [{ ...group, todos }] : []
  })
}
