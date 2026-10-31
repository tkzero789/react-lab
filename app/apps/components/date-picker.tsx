"use client"

/* Form field that picks one local date from a popover calendar */

import React from "react"
import { addDays, format, startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type DatePreset = {
  label: string
  /* Days from today */
  days: number
}

type Props = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "onChange" | "children"
> & {
  value: Date | undefined
  onChange: (date: Date) => void
  placeholder?: string
  presets?: DatePreset[]
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  presets,
  className,
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false)

  function select(date: Date) {
    onChange(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="input"
            {...props}
            className={cn(
              "w-full aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive-muted",
              open && "ring ring-ring",
              className
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {value ? format(value, "EEE, MMM d, yyyy") : placeholder}
          </Button>
        }
      />
      <PopoverContent align="start">
        <Calendar
          required
          mode="single"
          showOutsideDays={false}
          selected={value}
          defaultMonth={value}
          onSelect={select}
        />
        {presets && presets.length > 0 && (
          <div className="flex gap-2 border-t pt-2.5">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="flex-1"
                /* Match the calendar, which selects local midnight */
                onClick={() =>
                  select(startOfDay(addDays(new Date(), preset.days)))
                }
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
