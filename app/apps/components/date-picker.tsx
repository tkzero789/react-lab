"use client"

/* Form field that picks one local date from a popover calendar */

import React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Props = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "onChange" | "children"
> & {
  value: Date | undefined
  onChange: (date: Date) => void
  placeholder?: string
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="input"
            {...props}
            className={cn(
              "w-full aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
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
          selected={value}
          defaultMonth={value}
          onSelect={(next) => {
            onChange(next)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
