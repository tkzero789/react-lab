"use client"

import React from "react"
import { CalendarIcon, MapPinIcon, MinusCircleIcon } from "lucide-react"
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
import { format } from "date-fns"
import FileUpload from "./file-upload"
import { FileMetadata, FileWithPreview } from "@/app/hooks/use-file-upload"
import { Textarea } from "@/components/ui/textarea"
import { Todo, type TodoForm } from "../types"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  todo?: Todo
  onSubmit: (values: TodoForm) => void
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
  const [date, setDate] = React.useState<Date | undefined>(
    todo?.date ? new Date(todo.date) : undefined
  )

  const [images, setImages] = React.useState<FileWithPreview[]>(() =>
    initialFiles.map((file) => ({ file, id: file.id, preview: file.url }))
  )

  const [form, setForm] = React.useState<TodoForm>({
    text: todo?.text ?? "",
    date: todo?.date ?? date?.getTime(),
    location: todo?.location ?? "",
  })

  function handleOnChange(key: keyof Todo, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function handleDateSelect(newDate: Date) {
    setDate(newDate)
    setForm((prev) => ({ ...prev, date: newDate.getTime() }))
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.text.trim()) {
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
      date: date?.getTime() || 0,
      location: form.location,
      files,
      imageIds,
    })
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2 p-4"
    >
      <Textarea
        placeholder="Todo"
        value={form.text}
        onChange={(e) => handleOnChange("text", e.target.value)}
        className="resize-none"
      />

      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="input"
              className={cn(
                "group relative w-full",
                isDateOpen && "ring ring-ring"
              )}
            >
              <CalendarIcon data-icon="inline-start" />
              {date ? format(date, "EEE, MMM d, yyyy") : "Date"}
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost-destructive",
                    size: "icon-xs",
                  }),
                  "absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 border-0 group-hover:flex [&_svg]:text-destructive!"
                )}
              >
                <MinusCircleIcon />
              </div>
            </Button>
          }
        />
        <PopoverContent align="start">
          <Calendar
            required
            mode="single"
            selected={date}
            onSelect={(date) => {
              handleDateSelect(date)
              setIsDateOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      <InputGroup className="group">
        <InputGroupAddon>
          <MapPinIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Location"
          value={form.location}
          onChange={(e) => handleOnChange("location", e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost-destructive"
            size="icon-xs"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                location: "",
              }))
            }
          >
            <MinusCircleIcon className="lg:hidden lg:group-hover:block" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex w-full flex-col gap-2">
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
