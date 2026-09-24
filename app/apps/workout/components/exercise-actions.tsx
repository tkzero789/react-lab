"use client"

/* Edit and delete menu for an exercise card */

import React from "react"
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
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import UpdateExerciseForm, { Exercise } from "./update-exercise"

type Props = {
  exercise: Exercise
  onRemove: () => void
}

type View = "menu" | "edit" | "delete"

/*
 * One drawer swaps between the menu and the edit form on mobile.
 * Delete needs a clear decision, so it uses the alert dialog on all screens.
 */
export default function ExerciseActions({ exercise, onRemove }: Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<View>("menu")

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
          fitContent={view !== "edit"}
        >
          <DrawerTrigger render={trigger} />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {view === "edit" ? "Edit Exercise" : exercise.name}
              </DrawerTitle>
            </DrawerHeader>
            {view === "edit" ? (
              <DrawerBody className="flex flex-col p-0">{editForm}</DrawerBody>
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
