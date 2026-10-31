"use client"

/* Emoji picker with search, built on Frimousse */

import * as React from "react"
import {
  EmojiPicker as EmojiPickerPrimitive,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
} from "frimousse"
import { SearchIcon } from "lucide-react"

import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/* The phone app runs on Android 16, which draws emoji up to Emoji 16. The cap keeps an emoji from the web visible on the phone. */
const EMOJI_VERSION = 16

function EmojiPicker({
  className,
  style,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      data-slot="emoji-picker"
      emojiVersion={EMOJI_VERSION}
      className={cn(
        "isolate flex h-full w-fit flex-col gap-2 bg-popover text-popover-foreground",
        className
      )}
      style={
        {
          "--frimousse-emoji-font": "var(--font-emoji)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <InputGroup data-slot="emoji-picker-search-wrapper">
      <InputGroupAddon>
        <SearchIcon className="size-4 shrink-0" />
      </InputGroupAddon>
      <EmojiPickerPrimitive.Search
        data-slot="input-group-control"
        placeholder="Search emoji"
        className={cn(
          "h-8 w-full bg-transparent px-2 text-sm outline-hidden placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </InputGroup>
  )
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div {...props} data-slot="emoji-picker-row" className="scroll-my-1 px-1">
      {children}
    </div>
  )
}

function EmojiPickerEmoji({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button
      {...props}
      data-slot="emoji-picker-emoji"
      className={cn(
        "flex size-8 items-center justify-center rounded-sm text-xl data-active:bg-muted",
        className
      )}
    >
      {emoji.emoji}
    </button>
  )
}

function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...props}
      data-slot="emoji-picker-category-header"
      className="bg-popover px-2 pt-3 pb-1.5 text-xs leading-none font-medium text-muted-foreground"
    >
      {category.label}
    </div>
  )
}

function EmojiPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      data-slot="emoji-picker-viewport"
      className={cn("relative flex-1 scrollbar-thin outline-hidden", className)}
      {...props}
    >
      <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <Spinner />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
        No emoji found
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        className="pb-1 select-none"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
      />
    </EmojiPickerPrimitive.Viewport>
  )
}

/* Shows the name of the emoji under the pointer or the keyboard focus */
function EmojiPickerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="emoji-picker-footer"
      className={cn(
        "flex h-8 min-w-0 items-center gap-2 border-t px-1 pt-2",
        className
      )}
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <span className="font-emoji text-xl leading-none">
                {emoji.emoji}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              Select an emoji
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  )
}

export { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter }
