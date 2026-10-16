"use client"

/* Edit and delete menu for an exercise card */

import React from "react"
import { EllipsisIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UpdateExerciseForm, { Exercise } from "./update-exercise"

type Props = {
  exercise: Exercise
  onRemove: () => void
}

type View = "edit" | "delete"

export default function ExerciseActions({ exercise, onRemove }: Props) {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<View>("edit")

  function show(next: View) {
    setView(next)
    setOpen(true)
  }

  const trigger = (
    <Button variant="ghost" size="icon-sm" aria-label="Exercise actions">
      <EllipsisIcon />
    </Button>
  )
  const editForm = (
    <UpdateExerciseForm exercise={exercise} onSaved={() => setOpen(false)} />
  )
  const deleteMessage = (
    <>
      Delete <span className="font-semibold">{exercise.name}</span>?
    </>
  )
  const confirmDelete = (
    <AlertDialogAction
      variant="destructive"
      onClick={() => {
        onRemove()
        setOpen(false)
      }}
    >
      Delete
    </AlertDialogAction>
  )

  const deleteDialog = (
    <AlertDialog open={open && view === "delete"} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {confirmDelete}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => show("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => show("delete")}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open && view === "edit"} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <DialogBody className="flex flex-1 flex-col p-0">
            {editForm}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {deleteDialog}
    </>
  )
}
