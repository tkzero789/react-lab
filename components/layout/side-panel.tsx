"use client"

/* Side panel of a panel layout. It is a grid column when it fits in the window and a sheet when it does not. */

import React from "react"
import { Sheet, SheetBody, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type Props = {
  side: "left" | "right"
  label: string
  /* True when the window has space for the panel as a column */
  inline: boolean
  /* Applies only to the sheet. A column is always visible. */
  open: boolean
  onOpenChange: (open: boolean) => void
  /* The element that gets focus when the sheet closes. The default is the last focused element. */
  finalFocus?: React.ComponentProps<typeof SheetContent>["finalFocus"]
  children: React.ReactNode
}

export default function SidePanel({
  side,
  label,
  inline,
  open,
  onOpenChange,
  finalFocus,
  children,
}: Props) {
  if (inline) {
    return (
      <section
        aria-label={label}
        className={cn("min-w-0", side === "left" ? "border-r" : "border-l")}
      >
        <div className="sticky top-0 h-full max-h-svh overflow-y-auto">
          {children}
        </div>
      </section>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* The default close button covers the top row of the panel content */}
      <SheetContent
        side={side}
        aria-label={label}
        showCloseButton={false}
        finalFocus={finalFocus}
      >
        <SheetBody className="flex-1 p-0">{children}</SheetBody>
      </SheetContent>
    </Sheet>
  )
}
