"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

type Props = {
  exerciseName?: string
  date: Date
  onConfirm: () => void
}

/* On mobile this is a nested drawer, so it must render inside DayDetails */
export default function DeleteLog({ exerciseName, date, onConfirm }: Props) {
  const isMobile = useIsMobile()

  const trigger = (
    <Button variant="ghost" size="icon-sm" aria-label="Delete workout">
      <Trash2 />
    </Button>
  )
  const message = (
    <>
      Remove <span className="font-medium">{exerciseName}</span> from{" "}
      {format(date, "EEEE, MMM d, yyyy")}
    </>
  )
  const confirm = (
    <Button variant="destructive" onClick={onConfirm}>
      Delete
    </Button>
  )

  if (isMobile) {
    return (
      <DrawerNested>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Delete workout</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="text-sm">{message}</DrawerBody>
          <DrawerFooter>{confirm}</DrawerFooter>
        </DrawerContent>
      </DrawerNested>
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete workout</DialogTitle>
        </DialogHeader>
        <DialogBody>{message}</DialogBody>
        <DialogFooter>{confirm}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
