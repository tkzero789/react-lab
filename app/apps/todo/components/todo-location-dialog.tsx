"use client"

/* Dialog that picks a todo location on a map */

import { useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { placeQueries, type LocationValue } from "../places"

/* The map library is large, so it loads only when the dialog opens */
const TodoLocationPicker = dynamic(() => import("./todo-location-picker"), {
  ssr: false,
  loading: () => <PickerFallback />,
})

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: LocationValue
  onPick: (value: LocationValue) => void
}

export default function TodoLocationDialog({
  open,
  onOpenChange,
  value,
  onPick,
}: Props) {
  const start = useQuery({ ...placeQueries.lastPosition(), enabled: open })
  /* Wait for the last position, so the map does not jump from the world view to the street */
  const isReady = value.coordinates !== null || !start.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:h-[min(44rem,calc(100dvh-4rem))] md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose on map</DialogTitle>
        </DialogHeader>
        {isReady ? (
          <TodoLocationPicker
            initial={value}
            start={start.data ?? null}
            onPick={(next) => {
              onPick(next)
              onOpenChange(false)
            }}
          />
        ) : (
          <PickerFallback />
        )}
      </DialogContent>
    </Dialog>
  )
}

function PickerFallback() {
  return <div className="min-h-0 flex-1 animate-pulse border-t bg-muted" />
}
