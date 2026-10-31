/* Emoji that marks a todo list */

import { cn } from "@/lib/utils"

type Props = {
  emoji: string
  className?: string
}

export default function ListEmoji({ emoji, className }: Props) {
  return (
    <span
      aria-hidden
      className={cn("shrink-0 font-emoji leading-none", className)}
    >
      {emoji}
    </span>
  )
}
