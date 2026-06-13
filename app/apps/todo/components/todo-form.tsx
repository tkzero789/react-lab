"use client"

import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import React, { SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  DeleteIcon,
  Link2Icon,
  LucideIcon,
  MapPinIcon,
  MinusCircleIcon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Doc } from "@/convex/_generated/dataModel"
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

type Props = {
  todo?: Doc<"todos">
  onSuccess?: () => void
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

export default function TodoForm({ todo, onSuccess }: Props) {
  const isEditing = todo != null

  const [date, setDate] = React.useState<Date | undefined>(
    todo?.date ? new Date(todo.date) : undefined
  )

  const [form, setForm] = React.useState<Todo>({
    text: todo?.text ?? "",
    date: todo?.date ?? date?.getTime(),
    location: todo?.location ?? "",
    url: todo?.url ?? "",
  })

  console.log("date:", date)

  const [option, setOption] = React.useState<{
    isDate: boolean
    isLocation: boolean
    isUrl: boolean
  }>({
    isDate: !!todo?.date,
    isLocation: !!todo?.location,
    isUrl: !!todo?.url,
  })

  const addTodo = useMutation(api.todos.add)
  const updateTodo = useMutation(api.todos.update)

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

  function handleRemoveOption(option: "isDate" | "isLocation" | "isUrl") {
    let value = ""
    if (option === "isDate") {
      value = "date"
    } else if (option === "isLocation") {
      value = "location"
    } else {
      value = "url"
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

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.text.trim()) {
      return
    }

    console.log(form)

    if (isEditing) {
      await updateTodo({
        id: todo._id,
        text: form.text,
        date: date?.getTime() || 0,
        location: form.location,
        url: form.url,
      })
    } else {
      await addTodo({
        text: form.text,
        date: date?.getTime() || 0,
        location: form.location,
        url: form.url,
      })
    }
  }

  return (
    <form
      id="todoForm"
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-2"
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
      <div className="flex items-center justify-center gap-1">
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
      </div>
    </form>
  )
}
