"use client"

/* Edit and delete menu for a logged exercise */

import React from "react"
import { format } from "date-fns"
import { EllipsisIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Doc } from "@/convex/_generated/dataModel"
import { useIsMobile } from "@/hooks/use-mobile"
import LogExerciseForm, { WorkoutSets } from "./log-exercise-form"

type Props = Pick<React.ComponentProps<typeof LogExerciseForm>, "exercises"> & {
  log: Doc<"workoutLogs">
  exerciseName?: string
  date: Date
  onUpdate: (sets: WorkoutSets) => void
  onRemove: () => void
}

type View = "menu" | "edit" | "delete"

/*
 * On mobile this is a nested drawer, so it must render inside DayDetails.
 * One drawer swaps between views to avoid a third drawer level.
 * Delete needs a clear decision, so it uses the alert dialog on all screens.
 */
export default function LogActions({
  log,
  exercises,
  exerciseName,
  date,
  onUpdate,
  onRemove,
}: Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<View>("menu")
  const formId = React.useId()

  function show(next: View) {
    setView(next)
    setOpen(true)
  }

  const trigger = (
    <Button variant="ghost" size="icon-sm" aria-label="Workout actions">
      <EllipsisIcon />
    </Button>
  )
  const editForm = (
    <LogExerciseForm
      id={formId}
      exercises={exercises}
      defaultValues={{ exerciseId: log.exerciseId, sets: log.sets }}
      lockExercise
      onSubmit={(_, sets) => {
        onUpdate(sets)
        setOpen(false)
      }}
    />
  )
  /* The button is outside the form, so it links to the form by ID */
  const save = (
    <Button form={formId} type="submit" className="w-full">
      Save Changes
    </Button>
  )
  const deleteMessage = (
    <>
      Remove <span className="font-medium">{exerciseName}</span> from{" "}
      {format(date, "EEEE, MMM d, yyyy")}?
    </>
  )
  const confirmDelete = (
    <Button
      variant="destructive"
      onClick={() => {
        onRemove()
        setOpen(false)
      }}
    >
      Delete
    </Button>
  )

  const deleteDialog = (
    <Dialog
      type="alert"
      open={open && view === "delete"}
      onOpenChange={setOpen}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogDescription>{deleteMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          {confirmDelete}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (isMobile) {
    return (
      <>
        {/* The drawer closes when the delete view opens the alert dialog */}
        <Drawer
          open={open && view !== "delete"}
          onOpenChange={(next) => (next ? show("menu") : setOpen(false))}
        >
          <DrawerTrigger render={trigger} />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {view === "edit" ? "Edit workout" : (exerciseName ?? "Workout")}
              </DrawerTitle>
            </DrawerHeader>
            {view === "edit" ? (
              <>
                <DrawerBody>{editForm}</DrawerBody>
                <DrawerFooter>{save}</DrawerFooter>
              </>
            ) : (
              <DrawerBody className="flex flex-col gap-2">
                <Button variant="muted" onClick={() => setView("edit")}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setView("delete")}>
                  Delete
                </Button>
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>
        {deleteDialog}
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => show("edit")}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => show("delete")}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open && view === "edit"} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit workout</DialogTitle>
          </DialogHeader>
          <DialogBody>{editForm}</DialogBody>
          <DialogFooter>{save}</DialogFooter>
        </DialogContent>
      </Dialog>

      {deleteDialog}
    </>
  )
}
