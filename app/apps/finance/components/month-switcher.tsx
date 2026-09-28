"use client"

/* Previous and next controls for the month that the page shows */

import { addMonths, format, isSameMonth, startOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

type Props = {
  month: Date
  onMonthChange: (month: Date) => void
}

export default function MonthSwitcher({ month, onMonthChange }: Props) {
  const isCurrentMonth = isSameMonth(month, new Date())

  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        <Button
          variant="muted"
          size="icon-sm"
          onClick={() => onMonthChange(addMonths(month, -1))}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="muted"
          size="sm"
          onClick={() => onMonthChange(startOfMonth(new Date()))}
          disabled={isCurrentMonth}
        >
          This month
        </Button>
        <Button
          variant="muted"
          size="icon-sm"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="Next month"
        >
          <ChevronRight />
        </Button>
      </ButtonGroup>
      <h2 className="text-base font-semibold">{format(month, "MMMM yyyy")}</h2>
    </div>
  )
}
