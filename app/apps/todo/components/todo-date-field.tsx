"use client"

/* Due date picker with quick date buttons for the todo panels */

import { addDays, isSameDay, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import DatePicker from "../../components/date-picker"

const QUICK_DATES = [
  { label: "Today", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "Next week", offset: 7 },
] as const

type Props = {
  id: string
  /* Zero means no date */
  value: number
  onChange: (date: number) => void
}

export default function TodoDateField({ id, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        id={id}
        value={value ? new Date(value) : undefined}
        onChange={(next) => onChange(next.getTime())}
        placeholder="No date"
      />
      <div className="flex flex-wrap gap-1.5">
        {QUICK_DATES.map(({ label, offset }) => {
          const date = startOfDay(addDays(new Date(), offset))
          const isActive = value !== 0 && isSameDay(value, date)
          return (
            <Button
              key={label}
              variant={isActive ? "default" : "outline"}
              size="sm"
              aria-pressed={isActive}
              onClick={() => onChange(date.getTime())}
            >
              {label}
            </Button>
          )
        })}
        <Button
          variant={value === 0 ? "default" : "outline"}
          size="sm"
          aria-pressed={value === 0}
          onClick={() => onChange(0)}
        >
          No date
        </Button>
      </div>
    </div>
  )
}
