"use client"

import { api } from "@/convex/_generated/api"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  ImageIcon,
  Link2Icon,
  LucideIcon,
  MapPinIcon,
  MinusCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { FunctionReturnType } from "convex/server"
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

type TodoDoc = FunctionReturnType<typeof api.todos.list>[number]

// The values the form collects. Newly picked files are handed up raw (the caller
// owns uploading them); `imageIds` are existing storage ids to keep. The final
// image set the caller persists is `imageIds` + the ids of the uploaded `files`.
export type TodoFormValues = {
  text: string
  date: number
  location: string
  url: string
  files: File[]
  imageIds: string[]
}

type Props = {
  id: string
  todo?: TodoDoc
  onSubmit: (values: TodoFormValues) => void
}

type Todo = {
  text: string
  date: number | undefined
  location: string
  url: string
}

function OptionButton({
  active,
  onToggle,
  icon: Icon,
}: {
  active: boolean
  onToggle: () => void
  icon: LucideIcon
}) {
  return (
    <Button
      nativeButton={true}
      variant="ghost"
      size="icon-sm"
      onClick={onToggle}
      className={cn(active && "bg-muted-foreground/15")}
    >
      <Icon />
    </Button>
  )
}

export default function TodoForm({ id, todo, onSubmit }: Props) {
  // Seed FileUpload with the existing stored images. Their `id` is the storage
  // id, which is how we tell kept-existing images apart from fresh picks.
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

  const [date, setDate] = React.useState<Date | undefined>(
    todo?.date ? new Date(todo.date) : undefined
  )

  const [images, setImages] = React.useState<FileWithPreview[]>(() =>
    initialFiles.map((file) => ({ file, id: file.id, preview: file.url }))
  )

  const [form, setForm] = React.useState<Todo>({
    text: todo?.text ?? "",
    date: todo?.date ?? date?.getTime(),
    location: todo?.location ?? "",
    url: todo?.url ?? "",
  })

  const [option, setOption] = React.useState<{
    isDate: boolean
    isLocation: boolean
    isUrl: boolean
    isImage: boolean
  }>({
    isDate: !!todo?.date,
    isLocation: !!todo?.location,
    isUrl: !!todo?.url,
    isImage: !!todo?.image?.length,
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

  function handleRemoveOption(
    option: "isDate" | "isLocation" | "isUrl" | "isImage"
  ) {
    let value = ""
    if (option === "isDate") {
      value = "date"
    } else if (option === "isLocation") {
      value = "location"
    } else if (option === "isUrl") {
      value = "url"
    } else {
      value = "image"
    }

    setOption((prev) => ({
      ...prev,
      [option]: false,
    }))

    setForm((prev) => ({
      ...prev,
      [value]: value === "date" ? date?.getTime() : undefined,
    }))
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.text.trim()) {
      return
    }

    // Split the current set: fresh picks are real Files to upload; existing
    // images are FileMetadata whose `id` is the storage id to keep.
    const activeImages = option.isImage ? images : []
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
      url: form.url,
      files,
      imageIds,
    })
  }

  console.log(images)

  return (
    <>
      <form
        id={id}
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col items-center gap-2 p-4"
      >
        <Input
          placeholder="Todo"
          value={form.text}
          onChange={(e) => handleOnChange("text", e.target.value)}
        />
        {option.isDate && (
          <InputGroup className="group">
            <InputGroupAddon className="ml-0! pl-2">
              <Popover>
                <PopoverTrigger
                  render={
                    <InputGroupButton size="icon-xs">
                      <CalendarIcon />
                    </InputGroupButton>
                  }
                />
                <PopoverContent align="start">
                  <Calendar
                    required
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
            <InputGroupInput
              readOnly
              placeholder="Date"
              value={date ? format(date, "EEE, MMM d, yyyy") : ""}
              className="pl-2"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="ghost-destructive"
                size="icon-xs"
                onClick={() => handleRemoveOption("isDate")}
              >
                <MinusCircleIcon className="hidden group-hover:block" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
        {option.isLocation && (
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
                onClick={() => handleRemoveOption("isLocation")}
              >
                <MinusCircleIcon className="hidden group-hover:block" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
        {option.isUrl && (
          <InputGroup className="group">
            <InputGroupAddon>
              <Link2Icon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Url"
              value={form.url}
              onChange={(e) => handleOnChange("url", e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="ghost-destructive"
                size="icon-xs"
                className="text-destructive"
                onClick={() => handleRemoveOption("isUrl")}
              >
                <MinusCircleIcon className="hidden group-hover:block" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
        {option.isImage && (
          <div className="grid w-full grid-cols-4 gap-2 md:grid-cols-5">
            <FileUpload
              maxFiles={10}
              onFilesChange={setImages}
              icon={ImageIcon}
              initialFiles={initialFiles}
              className="w-full"
            />
          </div>
        )}
      </form>
      <div className="mt-auto flex w-full items-center justify-around border-t p-2">
        <OptionButton
          active={option.isDate}
          onToggle={() =>
            setOption((prev) => ({
              ...prev,
              isDate: !prev.isDate,
            }))
          }
          icon={CalendarIcon}
        />
        <OptionButton
          active={option.isLocation}
          onToggle={() =>
            setOption((prev) => ({
              ...prev,
              isLocation: !prev.isLocation,
            }))
          }
          icon={MapPinIcon}
        />
        <OptionButton
          active={option.isUrl}
          onToggle={() =>
            setOption((prev) => ({
              ...prev,
              isUrl: !prev.isUrl,
            }))
          }
          icon={Link2Icon}
        />
        <OptionButton
          active={option.isImage}
          onToggle={() =>
            setOption((prev) => ({
              ...prev,
              isImage: !prev.isImage,
            }))
          }
          icon={ImageIcon}
        />
      </div>
    </>
  )
}
