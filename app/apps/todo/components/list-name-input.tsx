"use client"

/* Inline name field for a new or renamed todo list. Enter or blur saves. Escape cancels. */

import React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MAX_LIST_NAME_LENGTH } from "@/types/todo"

/* Focus falls to the body when a focused input unmounts. Move it back, but do not take it from a control the user clicked. */
export function restoreFocus(selector: string) {
  requestAnimationFrame(() => {
    if (document.activeElement === document.body) {
      document.querySelector<HTMLElement>(selector)?.focus()
    }
  })
}

export default function ListNameInput({
  label,
  defaultValue = "",
  onSubmit,
  onClose,
  className,
}: {
  label: string
  defaultValue?: string
  onSubmit: (name: string) => void
  onClose: () => void
  className?: string
}) {
  const [value, setValue] = React.useState(defaultValue)
  /* Enter closes the field, and the blur from that close must not save a second time */
  const isDone = React.useRef(false)

  function finish(save: boolean) {
    if (isDone.current) return
    isDone.current = true
    const name = value.trim()
    if (save && name && name !== defaultValue) onSubmit(name)
    onClose()
  }

  return (
    <Input
      aria-label={label}
      autoFocus
      value={value}
      maxLength={MAX_LIST_NAME_LENGTH}
      placeholder="List name"
      onChange={(e) => setValue(e.target.value)}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          finish(true)
        }
        if (e.key === "Escape") {
          e.stopPropagation()
          finish(false)
        }
      }}
      className={cn("h-8", className)}
    />
  )
}
