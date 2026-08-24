"use client"

import React from "react"
import { CalendarIcon, MapPinIcon, XIcon } from "lucide-react"
import { addDays, format, isSameDay, startOfDay } from "date-fns"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import FileUpload from "./file-upload"
import { FileMetadata, FileWithPreview } from "@/app/hooks/use-file-upload"
import { Textarea } from "@/components/ui/textarea"
import { Todo, TodoFormValues } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const QUICK_DATES = [
  { label: "Today", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "Next week", offset: 7 },
] as const

type Props = {
  id: string
  todo?: Todo
  onSubmit: (values: TodoFormValues) => void
}

export default function TodoForm({ id, todo, onSubmit }: Props) {
  const initialFiles: FileMetadata[] =
    todo?.imageObject.flatMap((item) =>
      item
        ? [
            {
              id: item.storageId,
              url: item.url ?? "",
              name: "image",
              size: item.size,
              type: item.contentType ?? "",
            },
          ]
        : []
    ) ?? []

  const [isDateOpen, setIsDateOpen] = React.useState<boolean>(false)
  // New todos default to today so the required field costs nothing to satisfy.
  const [date, setDate] = React.useState<Date | undefined>(() =>
    todo?.date ? new Date(todo.date) : startOfDay(new Date())
  )

  const [images, setImages] = React.useState<FileWithPreview[]>(() =>
    initialFiles.map((file) => ({ file, id: file.id, preview: file.url }))
  )

  const [form, setForm] = React.useState({
    text: todo?.text ?? "",
    location: todo?.location ?? "",
  })

  // Errors stay quiet until the first submit attempt.
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const isTextInvalid = isSubmitted && form.text.trim() === ""
  const isDateInvalid = isSubmitted && !date

  function handleOnChange(key: "text" | "location", value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitted(true)

    if (!form.text.trim() || !date) {
      return
    }

    const activeImages = images[0] ? images : []
    const files: File[] = []
    const imageIds: string[] = []
    for (const { file } of activeImages) {
      if (file instanceof File) files.push(file)
      else imageIds.push(file.id)
    }

    onSubmit({
      text: form.text,
      date: date.getTime(),
      location: form.location,
      files,
      imageIds,
    })
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-text`} className={labelClass}>
          Task
        </label>
        <Textarea
          id={`${id}-text`}
          placeholder="What needs doing?"
          value={form.text}
          onChange={(e) => handleOnChange("text", e.target.value)}
          aria-invalid={isTextInvalid}
          aria-describedby={isTextInvalid ? `${id}-text-error` : undefined}
          className="resize-none"
        />
        {isTextInvalid ? (
          <p id={`${id}-text-error`} className="text-xs text-destructive">
            Give the todo a name.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={labelClass}>Due date</span>
          {date ? (
            <Button
              variant="link"
              size="xs"
              className="text-muted-foreground"
              onClick={() => setDate(undefined)}
            >
              Clear
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Required</span>
          )}
        </div>

        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="input"
                aria-invalid={isDateInvalid}
                className={cn(
                  "w-full aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                  isDateOpen && "ring ring-ring"
                )}
              >
                <CalendarIcon data-icon="inline-start" />
                {date ? format(date, "EEE, MMM d, yyyy") : "Pick a date"}
              </Button>
            }
          />
          <PopoverContent align="start">
            <Calendar
              required
              mode="single"
              selected={date}
              onSelect={(next) => {
                setDate(next)
                setIsDateOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-wrap gap-2">
          {QUICK_DATES.map(({ label, offset }) => {
            const value = startOfDay(addDays(new Date(), offset))
            const isActive = date !== undefined && isSameDay(date, value)
            return (
              <Button
                key={label}
                variant={isActive ? "default" : "outline"}
                size="sm"
                aria-pressed={isActive}
                className="rounded-full"
                onClick={() => setDate(value)}
              >
                {label}
              </Button>
            )
          })}
        </div>

        {isDateInvalid ? (
          <p className="text-xs text-destructive">Pick a due date.</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-location`} className={labelClass}>
          Location
        </label>
        <InputGroup>
          <InputGroupAddon>
            <MapPinIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={`${id}-location`}
            placeholder="Add a place (optional)"
            value={form.location}
            onChange={(e) => handleOnChange("location", e.target.value)}
          />
          {form.location ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Clear location"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    location: "",
                  }))
                }
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Attachments</span>
        <FileUpload
          maxFiles={10}
          onFilesChange={setImages}
          initialFiles={initialFiles}
          className="w-full"
        />
      </div>
    </form>
  )
}

const labelClass = "text-xs font-medium text-muted-foreground"
