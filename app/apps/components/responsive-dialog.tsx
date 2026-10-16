"use client"

/* Dialog on desktop and drawer on mobile, for the finance forms */

import React from "react"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  trigger?: React.ReactElement
  children: React.ReactNode
}

export default function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  trigger,
  children,
}: Props) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger render={trigger} />}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col p-0">{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-1 flex-col p-0">{children}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
