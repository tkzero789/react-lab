import { api } from "@/convex/_generated/api"
import { FunctionReturnType } from "convex/server"

export type Todo = FunctionReturnType<typeof api.todos.list>[number]

export type TodoForm = {
  text: string
  date: number | undefined
  location: string
  files?: File[]
  imageIds?: string[]
}
