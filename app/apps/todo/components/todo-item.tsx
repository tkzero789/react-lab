"use client"

import {
  CalendarIcon,
  CheckIcon,
  LucideIcon,
  MapPinIcon,
  PaperclipIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateTone, getDateInfo } from "../dates"
import { Todo } from "../types"

const MAX_THUMBNAILS = 3

const TONE_CLASS: Record<DateTone, string> = {
  late: "text-destructive font-medium",
  now: "text-foreground font-medium",
  soon: "text-muted-foreground",
  far: "text-muted-foreground",
}

type Props = {
  todo: Todo
  onEdit: (todo: Todo) => void
  onToggle: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export default function TodoItem({ todo, onEdit, onToggle, onDelete }: Props) {
  const isCompleted = todo.status === "completed"
  const dateInfo = isCompleted ? null : getDateInfo(todo.date)

  const attachments = todo.imageObject.flatMap((item) => (item ? [item] : []))
  // Older uploads can be missing contentType — assume image so they still
  // render as thumbnails rather than silently becoming a "1 file" chip.
  const images = attachments.flatMap((item) =>
    item.url && (item.contentType?.startsWith("image/") ?? true)
      ? [{ storageId: item.storageId, url: item.url }]
      : []
  )
  const thumbnails = images.slice(0, MAX_THUMBNAILS)
  const overflowCount = images.length - thumbnails.length
  const fileCount = attachments.length - images.length

  const hasMeta = dateInfo !== null || todo.location !== "" || fileCount > 0

  return (
    <li className="group relative rounded-xl border border-transparent transition-colors hover:border-border hover:bg-card">
      <div className="flex gap-3 p-3">
        <button
          type="button"
          onClick={() => onToggle(todo)}
          aria-pressed={isCompleted}
          aria-label={
            isCompleted ? `Reopen “${todo.text}”` : `Complete “${todo.text}”`
          }
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ring transition-colors hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            isCompleted && "border-primary bg-primary text-primary-foreground"
          )}
        >
          {isCompleted ? (
            <CheckIcon className="size-3" strokeWidth={3} />
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => onEdit(todo)}
          className="flex min-w-0 flex-1 flex-col gap-2 pr-18 text-left focus-visible:outline-none"
        >
          <span
            className={cn(
              "text-sm leading-snug font-medium text-pretty",
              isCompleted &&
                "text-muted-foreground line-through decoration-ring"
            )}
          >
            {todo.text}
          </span>

          {hasMeta ? (
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {dateInfo ? (
                <Chip icon={CalendarIcon} tone={dateInfo.tone}>
                  {dateInfo.label}
                </Chip>
              ) : null}
              {todo.location ? (
                <Chip icon={MapPinIcon}>{todo.location}</Chip>
              ) : null}
              {fileCount > 0 ? (
                <Chip icon={PaperclipIcon}>
                  {fileCount} {fileCount === 1 ? "file" : "files"}
                </Chip>
              ) : null}
            </span>
          ) : null}

          {images.length > 0 ? (
            <span className="flex items-center gap-1.5">
              {thumbnails.map((image) => (
                <span
                  key={image.storageId}
                  className={cn(
                    "relative size-13 shrink-0 overflow-hidden rounded-lg border bg-background",
                    isCompleted && "opacity-50"
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                </span>
              ))}
              {overflowCount > 0 ? (
                <span className="flex size-13 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                  +{overflowCount}
                </span>
              ) : null}
            </span>
          ) : null}
        </button>
      </div>

      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit “${todo.text}”`}
          onClick={() => onEdit(todo)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost-destructive"
          size="icon-sm"
          aria-label={`Delete “${todo.text}”`}
          onClick={() => onDelete(todo)}
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  )
}

function Chip({
  icon: Icon,
  tone = "soon",
  children,
}: {
  icon: LucideIcon
  tone?: DateTone
  children: React.ReactNode
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1.5", TONE_CLASS[tone])}>
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate text-xs">{children}</span>
    </span>
  )
}
