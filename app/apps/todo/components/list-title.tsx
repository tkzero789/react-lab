"use client"

/* Page title of a todo list that turns into a name field on click */

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/lib/toast"
import ListNameInput, { restoreFocus } from "./list-name-input"
import { List } from "../types"

export default function ListTitle({ list }: { list: List }) {
  const id = React.useId()
  const [isRenaming, setIsRenaming] = React.useState(false)

  const { mutate: renameList } = useMutation({
    mutationFn: useConvexMutation(api.todoLists.rename),
    onError: (error) => toast.error(error.message),
  })

  if (isRenaming) {
    return (
      <ListNameInput
        label="List name"
        defaultValue={list.name}
        onSubmit={(name) => renameList({ id: list._id, name })}
        onClose={() => {
          setIsRenaming(false)
          restoreFocus(`#${CSS.escape(id)}`)
        }}
        className="w-72 max-w-full px-2 text-xl font-semibold"
      />
    )
  }

  return (
    <h1 className="min-w-0 text-xl font-semibold">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              id={id}
              variant="ghost"
              onClick={() => setIsRenaming(true)}
              className="max-w-full px-2 text-xl font-semibold"
            />
          }
        >
          <span className="truncate">{list.name}</span>
        </TooltipTrigger>
        <TooltipContent>Rename list</TooltipContent>
      </Tooltip>
    </h1>
  )
}
