"use client"

/* List picker for the todo panels */

import { Id } from "@/convex/_generated/dataModel"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ListEmoji from "./list-emoji"
import { List } from "../types"

type ListId = Id<"todoLists">

type Props = {
  labelId: string
  lists: List[]
  value: ListId | null
  onChange: (value: ListId | null) => void
}

export default function TodoListField({
  labelId,
  lists,
  value,
  onChange,
}: Props) {
  const items = [
    { value: null, label: "No list" },
    ...lists.map((list) => ({ value: list._id, label: list.name })),
  ]

  function renderLabel(id: ListId | null) {
    const list = lists.find((item) => item._id === id)
    if (!list) return "No list"
    return (
      <>
        <ListEmoji emoji={list.emoji} />
        {list.name}
      </>
    )
  }

  return (
    <Select<ListId | null>
      items={items}
      value={value}
      onValueChange={(next) => onChange(next)}
    >
      <SelectTrigger aria-labelledby={labelId} className="w-full">
        <SelectValue>{renderLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value ?? "none"} value={item.value}>
              {renderLabel(item.value)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
