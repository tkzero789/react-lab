"use client"

/* Emoji button and popover that change the emoji of a todo list */

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/lib/toast"
import ListEmoji from "./list-emoji"
import { List } from "../types"

type PopoverProps = {
  list: List
  open: boolean
  onOpenChange: (open: boolean) => void
  /* A popover without a trigger, such as one opened from a menu item, needs an anchor */
  anchor?: React.ComponentProps<typeof PopoverContent>["anchor"]
  children?: React.ReactNode
}

export function ListEmojiPopover({
  list,
  open,
  onOpenChange,
  anchor,
  children,
}: PopoverProps) {
  const { mutate: setEmoji } = useMutation({
    mutationFn: useConvexMutation(api.todoLists.setEmoji),
    onError: (error) => toast.error(error.message),
  })

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children}
      <PopoverContent align="start" anchor={anchor} className="h-96 p-2">
        <EmojiPicker
          onEmojiSelect={({ emoji }) => {
            onOpenChange(false)
            if (emoji !== list.emoji) setEmoji({ id: list._id, emoji })
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  )
}

export default function ListEmojiPicker({ list }: { list: List }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ListEmojiPopover list={list} open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Change emoji for ${list.name}`}
                />
              }
            />
          }
        >
          <ListEmoji emoji={list.emoji} className="text-xl" />
        </TooltipTrigger>
        <TooltipContent>Change emoji</TooltipContent>
      </Tooltip>
    </ListEmojiPopover>
  )
}
