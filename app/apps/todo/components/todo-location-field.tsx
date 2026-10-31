"use client"

/* Location field for the todo panels. A click opens the map dialog. */

import { MapPinIcon } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type LocationValue } from "../places"
import TodoLocationDialog from "./todo-location-dialog"

type Props = {
  id: string
  value: LocationValue
  onChange: (value: LocationValue) => void
}

export default function TodoLocationField({ id, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  function pick(next: LocationValue) {
    const isSame =
      next.location === value.location &&
      next.coordinates?.latitude === value.coordinates?.latitude &&
      next.coordinates?.longitude === value.coordinates?.longitude
    if (!isSame) onChange(next)
  }

  return (
    <>
      <Button
        id={id}
        variant="input"
        onClick={() => setOpen(true)}
        className={cn("w-full", open && "ring ring-ring")}
      >
        <MapPinIcon data-icon="inline-start" />
        <span className="truncate">{value.location || "No location"}</span>
      </Button>
      <TodoLocationDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onPick={pick}
      />
    </>
  )
}
