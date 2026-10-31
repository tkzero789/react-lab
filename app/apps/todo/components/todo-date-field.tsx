"use client"

/* Due date picker for the todo panels */

import DatePicker, { type DatePreset } from "../../components/date-picker"

const PRESETS: DatePreset[] = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
]

type Props = {
  id: string
  /* Zero means no date */
  value: number
  onChange: (date: number) => void
}

export default function TodoDateField({ id, value, onChange }: Props) {
  return (
    <DatePicker
      id={id}
      value={value ? new Date(value) : undefined}
      onChange={(next) => onChange(next.getTime())}
      placeholder="No date"
      presets={PRESETS}
    />
  )
}
